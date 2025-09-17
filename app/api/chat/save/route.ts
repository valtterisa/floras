import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { appName, content, role } = await req.json();
    console.log("[/api/chat/save] request", {
      appName,
      role,
      contentLen: typeof content === "string" ? content.length : undefined,
    });
    if (!appName || !content || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
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
    const normalize = (val: unknown): string => {
      if (typeof val === "string") {
        if (val.trim() === "[object Object]") return "";
        return val;
      }
      if (val && typeof val === "object") {
        const v: any = val as any;
        const candidate =
          v.text ?? v.message ?? v.content ?? v.data?.text ?? "";
        return typeof candidate === "string" ? candidate : "";
      }
      return val != null ? String(val) : "";
    };

    const message = {
      id: Date.now().toString(),
      role: role === "user" ? "user" : "assistant",
      text: normalize(content),
      timestamp: new Date().toISOString(),
    } as const;

    await redis.rpush(chatKey, JSON.stringify(message));
    let newLen: number | null = null;
    try {
      newLen = await redis.llen(chatKey as string as any);
    } catch (_) {}
    console.log("[/api/chat/save] saved(list)", { chatKey, newLen });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
