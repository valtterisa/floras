import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { z } from "zod";
import { api } from "@/convex/_generated/api";
import { asProjectId } from "@/lib/convex/ids";
import {
  sandboxConfigured,
  getSandboxLifecycle,
  probePublicPreview,
} from "@/lib/sandbox/client";
import { isCanonicalSandboxName } from "@/lib/sandbox/config";
import { AppError } from "@/lib/errors";

export const runtime = "nodejs";

const LIVE_STATES = new Set(["ready"]);

const querySchema = z.object({
  projectId: z.string().min(1),
  mode: z.enum(["full", "preview"]).optional(),
});

export async function GET(req: Request) {
  const token = await convexAuthNextjsToken();
  if (!token) {
    return Response.json({ error: "Not authenticated", code: "auth" }, { status: 401 });
  }

  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    projectId: url.searchParams.get("projectId") ?? "",
    mode: url.searchParams.get("mode") ?? undefined,
  });
  if (!parsed.success) {
    return Response.json(
      { error: "projectId required", code: "unknown" },
      { status: 400 }
    );
  }

  if (!sandboxConfigured()) {
    return Response.json(
      { error: "Sandbox is not configured.", code: "config" },
      { status: 503 }
    );
  }

  const project = await fetchQuery(
    api.projects.get,
    { projectId: asProjectId(parsed.data.projectId) },
    { token }
  );

  if (!project) {
    return Response.json({ error: "Not found", code: "not_found" }, { status: 404 });
  }

  if (!project.sandboxName) {
    return Response.json({
      state: null as string | null,
      sandboxName: null as string | null,
      previewOk: false,
    });
  }

  if (
    typeof project.sandboxName !== "string" ||
    !isCanonicalSandboxName(parsed.data.projectId, project.sandboxName)
  ) {
    return Response.json(
      { error: "Invalid sandbox binding for this project.", code: "preview" },
      { status: 400 }
    );
  }

  const previewUrl =
    typeof project.previewUrl === "string" ? project.previewUrl : null;
  const mode = parsed.data.mode ?? "preview";

  try {
    if (mode === "preview") {
      const previewOk = previewUrl
        ? await probePublicPreview(previewUrl)
        : false;
      return Response.json({
        state: null as string | null,
        sandboxName: project.sandboxName,
        previewOk,
      });
    }

    const state = await getSandboxLifecycle(project.sandboxName);
    const previewOk =
      LIVE_STATES.has(state) && previewUrl
        ? await probePublicPreview(previewUrl)
        : false;
    return Response.json({
      state,
      sandboxName: project.sandboxName,
      previewOk,
    });
  } catch (err) {
    const error = err instanceof AppError ? err : AppError.from(err);
    console.error("preview status failed:", error.detail);
    return Response.json(
      {
        error:
          err instanceof AppError
            ? error.message
            : "Couldn't read sandbox status.",
        code: err instanceof AppError ? error.code : "preview",
      },
      { status: 500 }
    );
  }
}
