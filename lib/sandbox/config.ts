export const SITE_ROOT = process.env.BL_SITE_ROOT?.trim() || "/app";
export const PREVIEW_PORT = Number(
  process.env.BL_PREVIEW_PORT?.trim() || "4321"
);
export const DEV_PROCESS_NAME = "astro-dev";
export const PREVIEW_NAME = "floras-preview";
export const DEFAULT_SANDBOX_IMAGE = "blaxel/node:latest";

export function sandboxImage(): string {
  return process.env.BL_SANDBOX_IMAGE?.trim() || DEFAULT_SANDBOX_IMAGE;
}

export function requireTemplateRepo(): string {
  const repo = process.env.BL_TEMPLATE_REPO?.trim();
  if (!repo) {
    throw new Error(
      "BL_TEMPLATE_REPO is not set. Point it at the Astro template Git URL (e.g. https://github.com/org/floras-template.git)."
    );
  }
  return repo;
}

export function templateRef(): string {
  return process.env.BL_TEMPLATE_REF?.trim() || "main";
}

export function templateGithubToken(): string | undefined {
  const token = process.env.BL_TEMPLATE_GITHUB_TOKEN?.trim();
  return token || undefined;
}

/** Embed a GitHub token into an https clone URL without logging it. */
export function authenticatedCloneUrl(
  repoUrl: string,
  token?: string
): string {
  if (!token) return repoUrl;
  try {
    const url = new URL(repoUrl);
    if (
      url.protocol !== "https:" ||
      (url.hostname !== "github.com" && !url.hostname.endsWith(".github.com"))
    ) {
      return repoUrl;
    }
    url.username = "x-access-token";
    url.password = token;
    return url.toString();
  } catch {
    return repoUrl;
  }
}

export function sandboxMemoryMb(): number {
  const raw = process.env.BL_SANDBOX_MEMORY_MB?.trim();
  const n = raw ? Number(raw) : 4096;
  return Number.isFinite(n) && n >= 1024 ? Math.floor(n) : 4096;
}

export function sandboxRegion(): string {
  return process.env.BL_SANDBOX_REGION?.trim() || "eu-lon-1";
}

export function sandboxNameForProject(projectId: string): string {
  const cleaned = projectId
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `floras-${cleaned || "site"}`;
}

export function isCanonicalSandboxName(
  projectId: string,
  sandboxName: string
): boolean {
  return sandboxName === sandboxNameForProject(projectId);
}

export function sandboxIdleTtl(): string | undefined {
  const raw = process.env.BL_SANDBOX_IDLE_TTL?.trim();
  if (raw === "0" || raw === "off" || raw === "none") return undefined;
  return raw || "60d";
}

export function assertSafeSiteRelativePath(path: string): string {
  const cleaned = path.replace(/^\/+/, "").trim();
  if (!cleaned || cleaned.includes("\0") || cleaned.includes("\\")) {
    throw new Error("Invalid file path");
  }
  const segments = cleaned.split("/");
  for (const segment of segments) {
    if (!segment || segment === "." || segment === "..") {
      throw new Error("Path must stay inside site/");
    }
  }
  return segments.join("/");
}

export function absoluteSitePath(relative: string): string {
  const root = SITE_ROOT.replace(/\/$/, "") || "/";
  if (!relative.replace(/^\/+/, "").trim()) return root === "" ? "/" : root;
  const safe = assertSafeSiteRelativePath(relative);
  const absolute = `${root}/${safe}`;
  const normalizedRoot = root.endsWith("/") ? root.slice(0, -1) : root;
  if (absolute !== normalizedRoot && !absolute.startsWith(`${normalizedRoot}/`)) {
    throw new Error("Path must stay inside site/");
  }
  return absolute;
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
  "Access-Control-Expose-Headers": "Content-Length, X-Request-Id",
  "Access-Control-Max-Age": "86400",
  Vary: "Origin",
};
