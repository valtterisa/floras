import { after } from "next/server";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { runPublish } from "@/lib/publish/run-publish";
import {
  publishAcceptedSchema,
  publishRequestSchema,
} from "@/lib/publish/types";
import { cloudflareConfigured } from "@/lib/cloudflare/pages";
import { boxConfigured } from "@/lib/box/client";

export const maxDuration = 300;
export const runtime = "nodejs";

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

  const parsed = publishRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "projectId required", code: "unknown" },
      { status: 400 }
    );
  }

  const { projectId } = parsed.data;

  const project = await fetchQuery(
    (api as any).projects.get,
    { projectId },
    { token }
  );

  if (!project) {
    return Response.json({ error: "Not found", code: "not_found" }, { status: 404 });
  }

  if (!project.boxId) {
    return Response.json(
      {
        error: "Publish requires a sandbox. Generate the site first.",
        code: "publish",
      },
      { status: 400 }
    );
  }

  if (!boxConfigured() || !cloudflareConfigured()) {
    return Response.json(
      {
        error: "Publishing is not configured right now.",
        code: "config",
      },
      { status: 503 }
    );
  }

  after(() => runPublish(projectId, token));

  const accepted = publishAcceptedSchema.parse({ ok: true as const });
  return Response.json(accepted, { status: 202 });
}
