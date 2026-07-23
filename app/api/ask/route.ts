import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { withAutumnModel } from "@/lib/billing/with-autumn-model";
import {
  isAgentModelId,
  resolveAgentModelId,
  type AgentModelId,
} from "@/lib/ai/models";

export const maxDuration = 60;
export const runtime = "nodejs";

const ASK_INSTRUCTIONS = `You are Floras — a sharp product partner that helps people figure out what website to build before they generate one.

Your job in ASK mode:
- Answer questions about site structure, sections, copy tone, audience, and visual direction
- Help refine a brief into a clear one-sentence build prompt
- Suggest concrete options when the user is stuck
- Stay concise: short paragraphs, optional bullets, no fluff

Do not claim you already built a site. Do not invent live URLs. When they are ready, tell them to turn off ASK mode and send a build prompt.`;

type AskMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: Request) {
  const token = await convexAuthNextjsToken();
  if (!token) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload = body as {
    message?: unknown;
    history?: unknown;
    modelId?: unknown;
  };

  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";
  if (!message) {
    return Response.json({ error: "message required" }, { status: 400 });
  }

  const requestedModelId =
    typeof payload.modelId === "string" ? payload.modelId : null;
  const modelId: AgentModelId = isAgentModelId(requestedModelId)
    ? requestedModelId
    : resolveAgentModelId(null);

  const history: AskMessage[] = Array.isArray(payload.history)
    ? payload.history
        .filter(
          (m): m is AskMessage =>
            Boolean(m) &&
            typeof m === "object" &&
            (m.role === "user" || m.role === "assistant") &&
            typeof m.content === "string" &&
            m.content.trim().length > 0
        )
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.content.trim() }))
    : [];

  try {
    const access = await fetchAction(
      (api as any).billingGate.getAccess,
      {},
      { token }
    );
    if (!access?.hasPaidPlan) {
      return Response.json(
        {
          error: "Pro plan required to ask Floras.",
          code: "NO_PLAN",
        },
        { status: 402 }
      );
    }
    if (access.creditAllowed === false) {
      return Response.json(
        {
          error: "AI credit balance too low. Top up to continue.",
          code: "NO_CREDITS",
        },
        { status: 402 }
      );
    }
  } catch {
  }

  const me = await fetchQuery((api as any).users.me, {}, { token });
  if (!me?.id) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const result = streamText({
    model: withAutumnModel(anthropic(modelId), me.id),
    system: ASK_INSTRUCTIONS,
    messages: [...history, { role: "user" as const, content: message }],
  });

  return result.toTextStreamResponse();
}
