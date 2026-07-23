import { after } from "next/server";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { runPublish } from "@/lib/publish/run-publish";
import { runUnpublish } from "@/lib/publish/run-unpublish";
import {
  publishAcceptedSchema,
  publishRequestSchema,
} from "@/lib/publish/types";
import { cloudflareConfigured } from "@/lib/cloudflare/pages";
import { boxConfigured } from "@/lib/box/client";
import { AppError } from "@/lib/errors";

export const maxDuration = 300;
export const runtime = "nodejs";

function errorJson(error: AppError, status: number) {
  return Response.json({ error: error.message, code: error.code }, { status });
}

function statusFor(error: AppError) {
  if (error.code === "auth") return 401;
  if (error.code === "not_found") return 404;
  if (error.code === "config") return 503;
  if (error.code === "domain") return 400;
  return 502;
}

export async function POST(req: Request) {
  const token = await convexAuthNextjsToken();
  if (!token) {
    return errorJson(new AppError("auth"), 401);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorJson(new AppError("unknown"), 400);
  }

  const parsed = publishRequestSchema.safeParse(body);
  if (!parsed.success) {
    return errorJson(new AppError("unknown"), 400);
  }

  const { projectId } = parsed.data;

  const project = await fetchQuery(
    (api as any).projects.get,
    { projectId },
    { token }
  );

  if (!project) {
    return errorJson(new AppError("not_found"), 404);
  }

  if (!project.boxId) {
    return errorJson(
      new AppError(
        "publish",
        "Publish requires a sandbox. Generate the site first."
      ),
      400
    );
  }

  if (!boxConfigured() || !cloudflareConfigured()) {
    return errorJson(new AppError("config"), 503);
  }

  after(() => runPublish(projectId, token));

  const accepted = publishAcceptedSchema.parse({ ok: true as const });
  return Response.json(accepted, { status: 202 });
}

export async function DELETE(req: Request) {
  const token = await convexAuthNextjsToken();
  if (!token) {
    return errorJson(new AppError("auth"), 401);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorJson(new AppError("unknown"), 400);
  }

  const parsed = publishRequestSchema.safeParse(body);
  if (!parsed.success) {
    return errorJson(new AppError("unknown"), 400);
  }

  if (!cloudflareConfigured()) {
    return errorJson(new AppError("config"), 503);
  }

  try {
    await runUnpublish(parsed.data.projectId, token);
    return Response.json({ ok: true as const });
  } catch (error) {
    const appError = AppError.from(error);
    console.error("Unpublish failed", {
      projectId: parsed.data.projectId,
      code: appError.code,
      detail: appError.detail,
    });
    return errorJson(appError, statusFor(appError));
  }
}
