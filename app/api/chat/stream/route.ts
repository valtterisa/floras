import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { generateAIResponseStream } from "@/app/actions";
import { rateLimit } from "@/lib/ratelimit";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest, context: NextFetchEvent) {
  const { message, appName, repoExists = false, websiteId } = await req.json();

  if (!message || !appName) {
    return NextResponse.json(
      { error: "Missing required parameters: message, appName" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Soft per-minute rate limit to protect infra (separate from monthly plan limits)
  const success = await rateLimit(2, "1m", user.id);
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  // Hard monthly chat limit by plan (server-side, atomic)
  const { data: enforce, error: enforceError } = await supabase.rpc(
    "enforce_chat_limit",
    { user_uuid: user.id, website_uuid: websiteId ?? null }
  );

  if (enforceError) {
    return NextResponse.json(
      { error: "Usage enforcement failed" },
      { status: 500 }
    );
  }

  const allowed = Array.isArray(enforce) ? enforce[0]?.allowed === true : false;
  const current = Array.isArray(enforce) ? (enforce[0]?.current_usage ?? 0) : 0;
  const limit = Array.isArray(enforce) ? (enforce[0]?.limit_value ?? 0) : 0;

  if (!allowed) {
    return NextResponse.json(
      {
        error: "AI usage limit reached for your plan",
        current,
        limit,
      },
      { status: 402 }
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let chunkCount = 0;
      const MAX_CHUNKS = 1000; // Limit total chunks to prevent memory issues
      const MAX_CHUNK_SIZE = 10 * 1024; // 10KB max per chunk

      try {
        // Emit submitted status immediately
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "status", value: "submitted" })}\n\n`
          )
        );

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "status", value: "streaming" })}\n\n`
          )
        );

        for await (const chunk of generateAIResponseStream(
          message,
          appName,
          repoExists
        )) {
          // Check chunk count limit
          if (chunkCount >= MAX_CHUNKS) {
            console.warn("Stream chunk limit reached, closing stream");
            break;
          }

          const chunkData = JSON.stringify(chunk);

          // Check chunk size limit
          if (chunkData.length > MAX_CHUNK_SIZE) {
            console.warn("Chunk size exceeded, truncating");
            const truncatedChunk = {
              ...chunk,
              ...(chunk.type === "analysis" && "content" in chunk
                ? {
                    content:
                      chunk.content.substring(0, MAX_CHUNK_SIZE - 100) + "...",
                  }
                : {}),
            };
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(truncatedChunk)}\n\n`)
            );
          } else {
            controller.enqueue(encoder.encode(`data: ${chunkData}\n\n`));
          }

          chunkCount++;

          // Add backpressure - pause briefly every 10 chunks
          if (chunkCount % 10 === 0) {
            await new Promise((resolve) => setTimeout(resolve, 1));
          }
        }

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "status", value: "ready" })}\n\n`
          )
        );

        controller.close();
      } catch (error) {
        const errorData = JSON.stringify({
          type: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
        controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "status", value: "error" })}\n\n`
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
