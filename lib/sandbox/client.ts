import { SandboxInstance } from "@blaxel/core";
import { AppError } from "@/lib/errors";
import {
  SITE_ROOT,
  PREVIEW_PORT,
  DEV_PROCESS_NAME,
  PREVIEW_NAME,
  PREVIEW_RESPONSE_HEADERS,
  sandboxImage,
  requireTemplateRepo,
  templateRef,
  templateGithubToken,
  authenticatedCloneUrl,
  sandboxMemoryMb,
  sandboxRegion,
  sandboxLog,
  absoluteSitePath,
  assertSafeSiteRelativePath,
  sandboxNameForProject,
  sandboxIdleTtl,
} from "@/lib/sandbox/config";

export type SandboxFile = {
  path: string;
  content: string;
};

export type SandboxLifecycle =
  | "ready"
  | "starting"
  | "stopped"
  | "stopping"
  | "error"
  | "unknown";

export type CommandResult = {
  exitCode: number | null | undefined;
  stdout: string;
  stderr: string;
  success: boolean;
};

export { sandboxNameForProject };

export function sandboxConfigured(): boolean {
  return Boolean(
    process.env.BL_API_KEY?.trim() && process.env.BL_TEMPLATE_REPO?.trim()
  );
}

function isUsableStatus(status: string | undefined): boolean {
  if (!status) return true;
  const s = status.toUpperCase();
  return (
    s === "DEPLOYED" ||
    s === "READY" ||
    s === "RUNNING" ||
    s === "ACTIVE" ||
    s === "STANDBY"
  );
}

function isDeadStatus(status: string | undefined): boolean {
  const s = String(status ?? "").toUpperCase();
  return (
    s === "FAILED" ||
    s === "TERMINATED" ||
    s === "TERMINATING" ||
    s === "DELETING"
  );
}

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isWorkloadUnavailable(error: unknown): boolean {
  const message = errorText(error);
  return (
    /WORKLOAD_UNAVAILABLE/i.test(message) ||
    /currently not available/i.test(message) ||
    /not yet ready to serve/i.test(message) ||
    (/status["']?\s*:\s*404/.test(message) &&
      /sandbox|workload|resource/i.test(message))
  );
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/** Blaxel: 500ms → 30s backoff, give up after ~60s. */
async function withWorkloadRetry<T>(
  sandboxName: string,
  label: string,
  fn: () => Promise<T>,
  opts?: { budgetMs?: number; initialMs?: number; maxMs?: number }
): Promise<T> {
  const budgetMs = opts?.budgetMs ?? 60_000;
  const maxMs = opts?.maxMs ?? 30_000;
  let delay = opts?.initialMs ?? 500;
  const started = Date.now();
  let lastError: unknown;

  for (;;) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const elapsed = Date.now() - started;
      if (!isWorkloadUnavailable(error) || elapsed + delay > budgetMs) {
        throw error;
      }
      sandboxLog(sandboxName, "retry", label, {
        delayMs: delay,
        elapsedMs: elapsed,
      });
      await sleep(delay);
      delay = Math.min(maxMs, delay * 2);
    }
  }
}

const POST_CREATE_SETTLE_MS = 4_000;

async function loadSandbox(name: string): Promise<SandboxInstance> {
  try {
    return await SandboxInstance.get(name);
  } catch (error) {
    throw new AppError("preview", "Sandbox not found.", {
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function getSandboxInstance(
  name: string
): Promise<SandboxInstance> {
  return loadSandbox(name);
}

export type SitePersistence = {
  projectId: string;
  token: string;
};

export async function createOrResumeSandbox(opts: {
  sandboxName: string;
  displayName?: string;
  persistence?: SitePersistence;
}): Promise<{ sandboxName: string }> {
  if (!sandboxConfigured()) {
    throw new AppError("config", "Blaxel sandboxes are not configured.");
  }

  const { sandboxName, displayName = sandboxName } = opts;
  const image = sandboxImage();
  const region = sandboxRegion();
  const idleTtl = sandboxIdleTtl();

  sandboxLog(sandboxName, "create", "createIfNotExists", {
    image,
    displayName,
    idleTtl: idleTtl ?? "off",
    templateRepo: requireTemplateRepo(),
    templateRef: templateRef(),
  });

  const createArgs: Parameters<typeof SandboxInstance.createIfNotExists>[0] = {
    name: sandboxName,
    image,
    memory: sandboxMemoryMb(),
    ports: [{ target: PREVIEW_PORT, protocol: "HTTP" }],
    labels: {
      app: "floras",
      displayName: displayName.slice(0, 63),
    },
    envs: [
      { name: "SANDBOX_DISABLE_PROCESS_LOGGING", value: "true" },
      { name: "HOST", value: "0.0.0.0" },
      { name: "PORT", value: String(PREVIEW_PORT) },
    ],
  };
  createArgs.region = region;
  if (idleTtl) {
    createArgs.lifecycle = {
      expirationPolicies: [
        {
          type: "ttl-idle",
          value: idleTtl,
          action: "delete",
        },
      ],
    };
  }

  const sandbox = await withWorkloadRetry(
    sandboxName,
    "createIfNotExists",
    () => SandboxInstance.createIfNotExists(createArgs)
  );
  const status = String(sandbox.status ?? "");
  if (status && !isUsableStatus(status) && isDeadStatus(status)) {
    throw new AppError("preview", "Sandbox failed to become ready.", {
      detail: `status=${status}`,
    });
  }

  await sleep(POST_CREATE_SETTLE_MS);
  await ensureSiteWorkspace(sandboxName, opts.persistence);
  sandboxLog(sandboxName, "create", "ready");
  return { sandboxName };
}

export async function deleteSandboxResources(
  sandboxName: string
): Promise<void> {
  try {
    await SandboxInstance.delete(sandboxName);
  } catch (error) {
    console.error("[sandbox] delete sandbox failed", {
      sandboxName,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function getSandboxLifecycle(
  sandboxName: string
): Promise<SandboxLifecycle> {
  try {
    const sandbox = await loadSandbox(sandboxName);
    const status = String(sandbox.status ?? "").toUpperCase();
    if (isUsableStatus(status)) return "ready";
    if (status === "FAILED") return "error";
    if (status === "TERMINATED") return "stopped";
    if (status === "TERMINATING" || status === "DELETING") return "stopping";
    return "unknown";
  } catch {
    return "unknown";
  }
}

export async function ensureSandboxReady(
  sandboxName: string,
  persistence?: SitePersistence
): Promise<void> {
  sandboxLog(sandboxName, "ready", "ensure");
  const lifecycle = await getSandboxLifecycle(sandboxName);
  if (lifecycle === "error") {
    throw new AppError("preview", "Sandbox is in an error state.", {
      detail: `sandbox ${sandboxName}`,
    });
  }
  if (lifecycle !== "ready") {
    sandboxLog(sandboxName, "ready", "createOrResume", { lifecycle });
    await createOrResumeSandbox({ sandboxName, persistence });
    return;
  }
  await loadSandbox(sandboxName);
  await ensureSiteWorkspace(sandboxName, persistence);
}

async function ensureSiteWorkspace(
  sandboxName: string,
  persistence?: SitePersistence
): Promise<void> {
  const present = await runCommand(
    sandboxName,
    `test -f ${shellQuote(`${SITE_ROOT}/package.json`)}`,
    { cwd: "/", timeoutSeconds: 30, retries: 3 }
  );
  if (present.success && present.exitCode === 0) {
    sandboxLog(sandboxName, "template", "already present");
    return;
  }

  if (persistence) {
    try {
      const { restoreSiteFromR2 } = await import(
        "@/lib/sandbox/site-persistence"
      );
      const restored = await restoreSiteFromR2(
        sandboxName,
        persistence.projectId,
        persistence.token
      );
      if (restored) return;
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      console.error("[sandbox] R2 restore failed", { sandboxName, detail });
      throw new AppError(
        "preview",
        "Couldn't restore the site snapshot. Try restart, or regenerate the site.",
        { detail }
      );
    }
  }

  await cloneTemplate(sandboxName);
}

async function cloneTemplate(sandboxName: string): Promise<void> {
  const repo = requireTemplateRepo();
  const ref = templateRef();
  const cloneUrl = authenticatedCloneUrl(repo, templateGithubToken());
  sandboxLog(sandboxName, "template", "cloning", {
    repo,
    ref,
    authenticated: Boolean(templateGithubToken()),
  });

  const script = [
    "set -euo pipefail",
    `ROOT=${shellQuote(SITE_ROOT)}`,
    `REF=${shellQuote(ref)}`,
    `URL=${shellQuote(cloneUrl)}`,
    'if [ -f "$ROOT/package.json" ]; then exit 0; fi',
    'command -v git >/dev/null 2>&1 || { echo "git is required in the sandbox image" >&2; exit 1; }',
    "TMP=$(mktemp -d)",
    'trap \'rm -rf "$TMP"\' EXIT',
    'git clone --depth 1 --branch "$REF" "$URL" "$TMP/repo"',
    'mkdir -p "$ROOT"',
    'find "$ROOT" -mindepth 1 -maxdepth 1 -exec rm -rf {} +',
    'cp -a "$TMP/repo/." "$ROOT/"',
    'rm -rf "$ROOT/.git"',
  ].join("\n");

  const clone = await runCommand(sandboxName, script, {
    cwd: "/",
    timeoutSeconds: 180,
    retries: 1,
  });
  if (!clone.success || clone.exitCode !== 0) {
    throw new AppError("preview", "Could not clone the site template repo.", {
      detail: redactSecrets(
        clone.stderr || clone.stdout || `exit ${clone.exitCode}`
      ),
    });
  }
  sandboxLog(sandboxName, "template", "cloned");
}

function redactSecrets(text: string): string {
  const token = templateGithubToken();
  if (!token) return text;
  return text.split(token).join("[redacted]");
}

export async function writeFiles(
  sandboxName: string,
  files: SandboxFile[]
): Promise<void> {
  const sandbox = await loadSandbox(sandboxName);
  if (files.length === 1) {
    const file = files[0]!;
    await sandbox.fs.write(absoluteSitePath(file.path), file.content);
    return;
  }
  await sandbox.fs.writeTree(
    files.map((f) => ({
      path: assertSafeSiteRelativePath(f.path),
      content: f.content,
    })),
    SITE_ROOT
  );
}

export async function readFile(
  sandboxName: string,
  path: string
): Promise<string> {
  const sandbox = await loadSandbox(sandboxName);
  return await sandbox.fs.read(absoluteSitePath(path));
}

export async function runCommand(
  sandboxName: string,
  command: string,
  opts: {
    cwd?: string;
    timeoutSeconds?: number;
    retries?: number;
    env?: Record<string, string>;
  } = {}
): Promise<CommandResult> {
  const cwd = opts.cwd === "." ? "/" : opts.cwd ?? SITE_ROOT;
  const timeoutSeconds = opts.timeoutSeconds ?? 120;
  const retries = opts.retries ?? 2;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await withWorkloadRetry(sandboxName, "exec", async () => {
        const sandbox = await loadSandbox(sandboxName);
        const res = await sandbox.process.exec({
          name: `cmd-${Date.now().toString(36)}-${attempt}`,
          command,
          workingDir: cwd,
          waitForCompletion: true,
          timeout: timeoutSeconds,
          ...(opts.env ? { env: opts.env } : {}),
        });
        const exitCode = res.exitCode ?? 1;
        return {
          exitCode,
          stdout: res.stdout ?? res.logs ?? "",
          stderr: res.stderr ?? "",
          success: exitCode === 0 && res.status !== "failed",
        };
      });
    } catch (error) {
      lastError = error;
      if (attempt >= retries || !isEdgeTimeout(error)) break;
      await sleep(2000 * (attempt + 1));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new AppError("preview", "Sandbox command failed.", {
        detail: String(lastError),
      });
}

function isEdgeTimeout(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    /\b504\b/.test(message) ||
    /gateway timeout/i.test(message) ||
    /unreachable at the edge/i.test(message)
  );
}

async function ensureSiteDeps(sandboxName: string): Promise<void> {
  const hasBinary = await runCommand(
    sandboxName,
    "test -x node_modules/.bin/astro",
    { timeoutSeconds: 30, retries: 3 }
  );
  if (hasBinary.success && hasBinary.exitCode === 0) return;

  const install = await runCommand(
    sandboxName,
    "if command -v pnpm >/dev/null 2>&1; then COREPACK_ENABLE_DOWNLOAD_PROMPT=0 pnpm install; elif command -v bun >/dev/null 2>&1; then bun install; else npm install; fi",
    { timeoutSeconds: 300, retries: 1 }
  );
  if (!install.success || install.exitCode !== 0) {
    throw new AppError("preview", "Could not install site dependencies.", {
      detail: install.stderr || install.stdout || `exit ${install.exitCode}`,
    });
  }
}

async function ensureDevServer(sandboxName: string): Promise<void> {
  try {
    await withWorkloadRetry(sandboxName, "devServer", async () => {
      await (
        await loadSandbox(sandboxName)
      ).process.exec({
        name: DEV_PROCESS_NAME,
        command:
          "if command -v pnpm >/dev/null 2>&1; then pnpm run dev; elif command -v bun >/dev/null 2>&1; then bun run dev; else npm run dev; fi",
        workingDir: SITE_ROOT,
        waitForPorts: [PREVIEW_PORT],
        restartOnFailure: true,
        maxRestarts: 25,
        env: {
          HOST: "0.0.0.0",
          PORT: String(PREVIEW_PORT),
        },
      });
    });
  } catch (error) {
    const message = errorText(error);
    if (/already exists/i.test(message)) return;
    throw new AppError("preview", "Could not start the site preview server.", {
      detail: message.slice(0, 500),
    });
  }
}

async function ensurePreviewUrl(sandboxName: string): Promise<string> {
  const preview = await withWorkloadRetry(sandboxName, "previewUrl", async () => {
    const sandbox = await loadSandbox(sandboxName);
    const body = {
      metadata: { name: PREVIEW_NAME },
      spec: {
        port: PREVIEW_PORT,
        public: true,
        responseHeaders: PREVIEW_RESPONSE_HEADERS,
      },
    };

    try {
      const existing = await sandbox.previews.get(PREVIEW_NAME);
      if (existing.spec?.public === true && existing.spec?.url) {
        return existing;
      }
      await sandbox.previews.delete(PREVIEW_NAME);
    } catch {
      /* create below */
    }

    return sandbox.previews.create(body);
  });
  const url = preview.spec?.url?.trim();
  if (!url || !/^https?:\/\//i.test(url)) {
    throw new AppError("preview", "Could not resolve public preview URL.", {
      detail: "Blaxel preview returned no URL",
    });
  }
  if (preview.spec?.public !== true) {
    throw new AppError("preview", "Preview URL is not public.", {
      detail: PREVIEW_NAME,
    });
  }
  return url.replace(/\/$/, "");
}

export async function startPreview(
  sandboxName: string,
  persistence?: SitePersistence
): Promise<string> {
  await ensureSandboxReady(sandboxName, persistence);
  await ensureSiteDeps(sandboxName);
  await ensureDevServer(sandboxName);
  return ensurePreviewUrl(sandboxName);
}

export async function restartPreview(
  sandboxName: string,
  persistence?: SitePersistence
): Promise<string> {
  if (persistence) {
    try {
      const { snapshotSiteToR2 } = await import(
        "@/lib/sandbox/site-persistence"
      );
      await snapshotSiteToR2(
        sandboxName,
        persistence.projectId,
        persistence.token
      );
    } catch (error) {
      const message = errorText(error);
      if (!isWorkloadUnavailable(error) && !/404|not found/i.test(message)) {
        throw error;
      }
      console.warn("[sandbox] snapshot skipped; sandbox unavailable", {
        sandboxName,
        detail: message.slice(0, 300),
      });
    }
  }

  await deleteSandboxResources(sandboxName);
  await createOrResumeSandbox({ sandboxName, persistence });
  await ensureSiteDeps(sandboxName);
  await ensureDevServer(sandboxName);
  return ensurePreviewUrl(sandboxName);
}

export async function getDevProcessLogs(
  sandboxName: string
): Promise<{ logs: string; found: boolean }> {
  try {
    const sandbox = await loadSandbox(sandboxName);
    const processes = await sandbox.process.list();
    const exists = processes.some((p) => p.name === DEV_PROCESS_NAME);
    if (!exists) {
      return { logs: "", found: false };
    }
    const logs = await sandbox.process.logs(DEV_PROCESS_NAME, "all");
    const raw = typeof logs === "string" ? logs : String(logs ?? "");
    const { redactSandboxLogs } = await import("@/lib/sandbox/redact-logs");
    return { logs: redactSandboxLogs(raw), found: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/404|not found/i.test(message)) {
      return { logs: "", found: false };
    }
    throw error;
  }
}

export async function probePublicPreview(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      headers: { Accept: "text/html" },
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return false;
    const body = await res.text();
    if (/upstream unavailable/i.test(body)) return false;
    if (/AUTHENTICATION_REQUIRED/i.test(body)) return false;
    return body.length > 0;
  } catch {
    return false;
  }
}

export async function buildSite(sandboxName: string): Promise<void> {
  await ensureSiteDeps(sandboxName);
  const res = await runCommand(
    sandboxName,
    "if command -v pnpm >/dev/null 2>&1; then pnpm run build; elif command -v bun >/dev/null 2>&1; then bun run build; else npm run build; fi",
    { timeoutSeconds: 300 }
  );
  if (!res.success || res.exitCode !== 0) {
    throw new AppError("publish", "Site build failed.", {
      detail: res.stderr || res.stdout || `exit ${res.exitCode}`,
    });
  }
}

export async function assertDistPresent(sandboxName: string): Promise<void> {
  const res = await runCommand(sandboxName, "test -f dist/index.html");
  if (!res.success || res.exitCode !== 0) {
    throw new AppError("publish", "Build output is missing.", {
      detail: "dist/index.html not found after build",
    });
  }
}

const EXPORT_TAR_PATH = "/tmp/.floras-export.tar.gz";
const DIST_TAR_PATH = "/tmp/.floras-dist.tar";

export async function exportSiteZip(
  sandboxName: string,
  persistence?: SitePersistence
): Promise<Blob> {
  await ensureSandboxReady(sandboxName, persistence);

  await runCommand(sandboxName, `rm -f ${shellQuote(EXPORT_TAR_PATH)}`, {
    cwd: "/",
    timeoutSeconds: 30,
  });

  try {
    const pack = await runCommand(
      sandboxName,
      `tar -C ${shellQuote(SITE_ROOT)} -czf ${shellQuote(EXPORT_TAR_PATH)} --exclude=node_modules --exclude=.git --exclude=.astro --exclude=dist --exclude='.floras-*' .`,
      { cwd: "/", timeoutSeconds: 180 }
    );
    if (!pack.success || pack.exitCode !== 0) {
      throw new AppError("unknown", "Couldn't create the project archive.", {
        detail: pack.stderr || pack.stdout || `exit ${pack.exitCode}`,
      });
    }
    return await (await loadSandbox(sandboxName)).fs.readBinary(EXPORT_TAR_PATH);
  } finally {
    await runCommand(sandboxName, `rm -f ${shellQuote(EXPORT_TAR_PATH)}`, {
      cwd: "/",
      timeoutSeconds: 30,
    }).catch((error) => {
      console.error("[sandbox] export archive cleanup failed", error);
    });
  }
}

export async function exportDistArchive(
  sandboxName: string
): Promise<Uint8Array> {
  await runCommand(sandboxName, `rm -f ${shellQuote(DIST_TAR_PATH)}`, {
    cwd: "/",
    timeoutSeconds: 30,
  });

  try {
    const pack = await runCommand(
      sandboxName,
      `tar -C ${shellQuote(`${SITE_ROOT}/dist`)} -cf ${shellQuote(DIST_TAR_PATH)} .`,
      { cwd: "/", timeoutSeconds: 180 }
    );
    if (!pack.success || pack.exitCode !== 0) {
      throw new AppError("publish", "Couldn't package the build output.", {
        detail: pack.stderr || pack.stdout || `exit ${pack.exitCode}`,
      });
    }
    const blob = await (await loadSandbox(sandboxName)).fs.readBinary(
      DIST_TAR_PATH
    );
    const buf = new Uint8Array(await blob.arrayBuffer());
    if (buf.byteLength === 0) {
      throw new AppError("publish", "Build output package is empty.");
    }
    return buf;
  } finally {
    await runCommand(sandboxName, `rm -f ${shellQuote(DIST_TAR_PATH)}`, {
      cwd: "/",
      timeoutSeconds: 30,
    }).catch((error) => {
      console.error("[sandbox] dist archive cleanup failed", error);
    });
  }
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}
