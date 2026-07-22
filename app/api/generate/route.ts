import { after } from "next/server";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import {
  AI_CREDITS_FEATURE,
  MIN_CREDIT_BALANCE,
} from "@/lib/billing/constants";
import { runGeneration } from "@/lib/generate/run-generation";

export const maxDuration = 300;
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

  try {
    const { data } = await fetchAction(
      (api as any).autumn.check,
      {
        featureId: AI_CREDITS_FEATURE,
        requiredBalance: MIN_CREDIT_BALANCE,
      },
      { token }
    );
    if (data?.allowed === false) {
      return Response.json(
        {
          error:
            "AI credit balance too low. Upgrade or top up to continue.",
        },
        { status: 402 }
      );
    }
  } catch {
  }

  after(() => runGeneration(projectId, token));

  return Response.json({ ok: true }, { status: 202 });
}
