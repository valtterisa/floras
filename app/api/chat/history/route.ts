import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const appName = url.searchParams.get("appName");
  if (!appName) {
    return NextResponse.json({ error: "Missing appName" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chatKey = `chat:${userId}:${appName}`;
  const messages = await redis.lrange(chatKey, 0, -1);
  if (!messages) {
    return NextResponse.json({ messages: [] });
  }
  messages.forEach((msg, index) => {
    try {
      let msgString: string;

      // Handle different data types from Redis
      if (typeof msg === "string") {
        msgString = msg;
      } else if (msg && typeof msg === "object") {
        // If it's already an object, try to stringify it
        msgString = JSON.stringify(msg);
      } else {
        msgString = String(msg);
      }

      const parsed = JSON.parse(msgString);
      console.log(`📝 [DEBUG] Message ${index}:`, {
        id: parsed.id,
        content: parsed.content?.substring(0, 50) + "...",
        isUser: parsed.isUser,
        timestamp: parsed.timestamp,
      });
    } catch (error) {
      console.log(`❌ [DEBUG] Failed to parse message ${index}:`, error);
      console.log(`❌ [DEBUG] Raw message type:`, typeof msg);
      console.log(`❌ [DEBUG] Raw message:`, msg);
    }
  });
  return NextResponse.json({ messages: messages });
}
