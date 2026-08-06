import { after } from "next/server";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { z } from "zod";
import { api } from "@/convex/_generated/api";
import { asProjectId } from "@/lib/convex/ids";
import {
  sandboxConfigured,
  getSandboxLifecycle,
  stopSandbox,
} from "@/lib/sandbox/client";
import { AppError } from "@/lib/errors";

export const maxDuration = 300;
export const runtime = "nodejs";

const requestSchema = z.object({
  projectId: z.string().min(1),
});

export async function POST(req: Request) {
  const token = await convexAuthNextjsToken();
  if (!token) {
    return Response.json({ error: "Not authenticated", code: "auth" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON", code: "unknown" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "projectId required", code: "unknown" },
      { status: 400 }
    );
  }

  if (!sandboxConfigured()) {
    return Response.json({ ok: true as const, skipped: true });
  }

  const project = await fetchQuery(
    api.projects.get,
    { projectId: asProjectId(parsed.data.projectId) },
    { token }
  );

  if (!project?.sandboxName) {
    return Response.json({ ok: true as const, skipped: true });
  }

  const sandboxName = project.sandboxName;
  const projectId = parsed.data.projectId;
  const status = typeof project.status === "string" ? project.status : "";
  const publishStatus =
    typeof project.publishStatus === "string" ? project.publishStatus : "";
  if (
    status === "provisioning" ||
    status === "generating" ||
    publishStatus === "publishing"
  ) {
    return Response.json({ ok: true as const, skipped: true });
  }

  try {
    const lifecycle = await getSandboxLifecycle(sandboxName);
    if (lifecycle === "stopped" || lifecycle === "stopping") {
      return Response.json({ ok: true as const, skipped: true });
    }

    after(() =>
      stopSandbox(sandboxName)
        .then(() => {
          if (process.env.DEBUG_SANDBOX === "1") {
            console.info("[preview:stop] background ok", {
              projectId,
              sandboxName,
            });
          }
        })
        .catch((err) => {
          const error = AppError.from(err);
          console.error("[preview:stop] background failed", {
            projectId,
            sandboxName,
            detail: error.detail,
            message: error.message,
          });
        })
    );

    return Response.json({ ok: true as const }, { status: 202 });
  } catch (err) {
    const error = AppError.from(err);
    console.error("[preview:stop] failed", {
      projectId,
      sandboxName,
      detail: error.detail,
      message: error.message,
    });
    return Response.json(
      { error: error.message, code: error.code },
      { status: 500 }
    );
  }
}
