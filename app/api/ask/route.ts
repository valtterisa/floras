import { after } from "next/server";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getAccess } from "@/lib/billing/get-access";
import { runAsk } from "@/lib/generate/run-ask";

export const maxDuration = 60;
export const runtime = "nodejs";

export async function POST(req: Request) {
  const token = await convexAuthNextjsToken();
  if (!token) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  let projectId: unknown;
  try {
    const body = await req.json();
    projectId = body?.projectId;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof projectId !== "string" || !projectId) {
    return Response.json({ error: "projectId required" }, { status: 400 });
  }

  const project = await fetchQuery(
    (api as any).projects.get,
    { projectId },
    { token }
  );

  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const me = await fetchQuery((api as any).users.me, {}, { token });
  if (!me?.id) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const access = await getAccess(me.id);
  if (!access.hasPaidPlan) {
    return Response.json(
      {
        error: "Pro plan required to ask Floras.",
        code: "NO_PLAN",
      },
      { status: 402 }
    );
  }
  if (!access.creditAllowed) {
    return Response.json(
      {
        error: "AI credit balance too low. Top up to continue.",
        code: "NO_CREDITS",
      },
      { status: 402 }
    );
  }

  after(() => runAsk(projectId, token));

  return Response.json({ ok: true }, { status: 202 });
}
