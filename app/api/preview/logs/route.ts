import { withPreviewProject } from "@/lib/api/with-preview-project";
import { getDevProcessLogs, getSandboxLifecycle } from "@/lib/sandbox/client";
import { appErrorResponse, AppError } from "@/lib/errors";

export const maxDuration = 300;
export const runtime = "nodejs";

export async function POST(req: Request) {
  const ctx = await withPreviewProject(req);
  if (ctx instanceof Response) return ctx;

  try {
    const lifecycle = await getSandboxLifecycle(ctx.sandboxName);
    if (
      lifecycle === "stopped" ||
      lifecycle === "stopping" ||
      lifecycle === "unknown" ||
      lifecycle === "error"
    ) {
      return Response.json({
        ok: true as const,
        found: false,
        logs: "",
        status: lifecycle,
      });
    }

    const result = await getDevProcessLogs(ctx.sandboxName);
    return Response.json(
      {
        ok: true as const,
        found: result.found,
        logs: result.logs.slice(-16_000),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err) {
    const error = AppError.from(err);
    console.error("[preview:logs] failed:", error.message);
    return appErrorResponse(
      err instanceof AppError
        ? err
        : new AppError("preview", "Couldn't read preview logs.")
    );
  }
}
