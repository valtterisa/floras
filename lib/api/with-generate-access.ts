import { after } from "next/server";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { assertRateLimit } from "@/lib/api/rate-limit";
import { asProjectId } from "@/lib/convex/ids";
import { getAccess } from "@/lib/billing/get-access";
import { AppError, appErrorResponse } from "@/lib/errors";

export async function withGenerateAccess(
  req: Request,
  opts: {
    busyStatuses?: string[];
    noPlanMessage: string;
    rateLimitName?: "generate" | "ask";
  }
): Promise<{ projectId: string; token: string; userId: string } | Response> {
  const token = await convexAuthNextjsToken();
  if (!token) {
    return appErrorResponse(new AppError("auth"), 401);
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
    api.projects.get,
    { projectId: asProjectId(projectId) },
    { token }
  );

  if (!project) {
    return appErrorResponse(new AppError("not_found"), 404);
  }

  const busy = opts.busyStatuses ?? [];
  const status = typeof project.status === "string" ? project.status : "";
  const publishStatus =
    typeof project.publishStatus === "string" ? project.publishStatus : "";
  if (
    busy.includes(status) ||
    (busy.includes("publishing") && publishStatus === "publishing")
  ) {
    return Response.json(
      { error: "Project is busy", code: "busy" },
      { status: 409 }
    );
  }

  const me = await fetchQuery(api.users.me, {}, { token });
  if (!me?.id) {
    return appErrorResponse(new AppError("auth"), 401);
  }

  try {
    await assertRateLimit({
      name: opts.rateLimitName ?? "generate",
      key: me.id,
    });
  } catch (error) {
    if (error instanceof AppError && error.code === "rate_limit") {
      return appErrorResponse(error, 429);
    }
    throw error;
  }

  const access = await getAccess(me.id);
  if (!access.hasSubscription) {
    return Response.json(
      { error: opts.noPlanMessage, code: "NO_PLAN" },
      { status: 402 }
    );
  }

  if (access.hasByokPlan && !access.hasProPlan) {
    if (!me.hasAnthropicKey) {
      return Response.json(
        {
          error:
            "Add your Anthropic API key in Account settings to use the BYOK plan.",
          code: "NO_API_KEY",
        },
        { status: 402 }
      );
    }
    return { projectId, token, userId: me.id };
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

  return { projectId, token, userId: me.id };
}

export function acceptBackgroundWork(work: () => Promise<void>) {
  after(() => work());
  return Response.json({ ok: true }, { status: 202 });
}
