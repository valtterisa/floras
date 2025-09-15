import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { linesSchema, resultSchema } from "@/components/error-monitor/schemas";

import { systemPrompt } from "@/lib/prompts/system";
import { anthropic } from "@ai-sdk/anthropic";

export async function POST(req: Request) {
  const body = await req.json();
  const parsedBody = linesSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({ error: `Invalid request` }, { status: 400 });
  }

  const result = await generateObject({
    system: systemPrompt,
    model: anthropic("claude-sonnet-4-20250514"),
    providerOptions: {
      openai: {
        include: ["reasoning.encrypted_content"],
        reasoningEffort: "minimal",
        reasoningSummary: "auto",
        serviceTier: "priority",
      },
    },
    messages: [{ role: "user", content: JSON.stringify(parsedBody.data) }],
    schema: resultSchema,
  });

  return NextResponse.json(result.object, {
    status: 200,
  });
}
