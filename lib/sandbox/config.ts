export const SITE_ROOT = process.env.BL_SITE_ROOT?.trim() || "/app";
export const PREVIEW_PORT = Number(
  process.env.BL_PREVIEW_PORT?.trim() || "4321"
);
export const DEV_PROCESS_NAME = "astro-dev";
export const PREVIEW_NAME = "floras-preview";

export function requireSandboxImage(): string {
  const image = process.env.BL_SANDBOX_IMAGE?.trim();
  if (!image) {
    throw new Error(
      "BL_SANDBOX_IMAGE is not set. Deploy an Astro sandbox template and set its image id."
    );
  }
  return image;
}

export function sandboxMemoryMb(): number {
  const raw = process.env.BL_SANDBOX_MEMORY_MB?.trim();
  const n = raw ? Number(raw) : 4096;
  return Number.isFinite(n) && n >= 1024 ? Math.floor(n) : 4096;
}

export function sandboxRegion(): string | undefined {
  const region = process.env.BL_SANDBOX_REGION?.trim();
  return region || undefined;
}

export function sandboxNameForProject(projectId: string): string {
  const cleaned = projectId
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `floras-${cleaned || "site"}`;
}

export function absoluteSitePath(relative: string): string {
  const cleaned = relative.replace(/^\/+/, "").trim();
  if (!cleaned) return SITE_ROOT;
  return `${SITE_ROOT.replace(/\/$/, "")}/${cleaned}`;
}

export function cfEnvPath(sandboxName: string): string {
  const safe =
    sandboxName.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24) || "sandbox";
  return `/tmp/.floras-cf-${safe}-${Date.now()}.env`;
}

export function sandboxLog(
  sandboxName: string,
  stage: string,
  message: string,
  extra?: Record<string, unknown>
): void {
  if (process.env.DEBUG_SANDBOX !== "1") return;
  console.info(`[sandbox:${stage}] ${message}`, {
    sandboxName,
    at: new Date().toISOString(),
    ...extra,
  });
}

export const PREVIEW_RESPONSE_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With, X-Blaxel-Workspace, X-Blaxel-Preview-Token, X-Blaxel-Authorization",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Expose-Headers": "Content-Length, X-Request-Id",
  "Access-Control-Max-Age": "86400",
  Vary: "Origin",
};
