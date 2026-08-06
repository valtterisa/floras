import { SandboxInstance } from "@blaxel/core";
import { AppError } from "@/lib/errors";
import {
  SITE_ROOT,
  PREVIEW_PORT,
  DEV_PROCESS_NAME,
  PREVIEW_NAME,
  PREVIEW_RESPONSE_HEADERS,
  requireSandboxImage,
  sandboxMemoryMb,
  sandboxRegion,
  sandboxLog,
  cfEnvPath,
  absoluteSitePath,
  sandboxNameForProject,
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

export type WranglerDeployCreds = {
  apiToken: string;
  accountId: string;
  projectName: string;
};

export { sandboxNameForProject };

export function sandboxConfigured(): boolean {
  return Boolean(
    process.env.BL_API_KEY?.trim() && process.env.BL_SANDBOX_IMAGE?.trim()
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

async function loadSandbox(name: string): Promise<SandboxInstance> {
  try {
    return await SandboxInstance.get(name);
  } catch (error) {
    throw new AppError("preview", "Sandbox not found.", {
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function createOrResumeSandbox(opts: {
  sandboxName: string;
  displayName?: string;
}): Promise<string> {
  if (!sandboxConfigured()) {
    throw new AppError("config", "Blaxel sandboxes are not configured.");
  }

  const { sandboxName, displayName = sandboxName } = opts;
  sandboxLog(sandboxName, "create", "createIfNotExists", {
    image: requireSandboxImage(),
    displayName,
  });

  const createArgs: Parameters<typeof SandboxInstance.createIfNotExists>[0] = {
    name: sandboxName,
    image: requireSandboxImage(),
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
  const region = sandboxRegion();
  if (region) createArgs.region = region;

  const sandbox = await SandboxInstance.createIfNotExists(createArgs);
  const status = String(sandbox.status ?? "");
  if (status && !isUsableStatus(status) && isDeadStatus(status)) {
    throw new AppError("preview", "Sandbox failed to become ready.", {
      detail: `status=${status}`,
    });
  }

  sandboxLog(sandboxName, "create", "ready");
  return sandboxName;
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

export async function ensureSandboxReady(sandboxName: string): Promise<void> {
  sandboxLog(sandboxName, "ready", "ensure");
  const lifecycle = await getSandboxLifecycle(sandboxName);
  if (lifecycle === "error") {
    throw new AppError("preview", "Sandbox is in an error state.", {
      detail: `sandbox ${sandboxName}`,
    });
  }
  if (lifecycle === "stopped" || lifecycle === "stopping") {
    sandboxLog(sandboxName, "ready", "recreating terminated sandbox");
    await createOrResumeSandbox({ sandboxName });
    return;
  }
  await loadSandbox(sandboxName);
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
      path: f.path.replace(/^\/+/, ""),
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
  } = {}
): Promise<CommandResult> {
  const cwd = opts.cwd === "." ? "/" : opts.cwd ?? SITE_ROOT;
  const timeoutSeconds = opts.timeoutSeconds ?? 120;
  const retries = opts.retries ?? 2;
  const sandbox = await loadSandbox(sandboxName);
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const t0 = Date.now();
    const procName = `cmd-${Date.now().toString(36)}-${attempt}`;
    sandboxLog(sandboxName, "cmd", "start", {
      cwd,
      timeoutSeconds,
      attempt: attempt + 1,
      command: command.length > 160 ? `${command.slice(0, 160)}…` : command,
    });
    try {
      const res = await sandbox.process.exec({
        name: procName,
        command,
        workingDir: cwd,
        waitForCompletion: true,
        timeout: timeoutSeconds,
      });
      const exitCode = res.exitCode ?? 1;
      const result: CommandResult = {
        exitCode,
        stdout: res.stdout ?? res.logs ?? "",
        stderr: res.stderr ?? "",
        success: exitCode === 0 && res.status !== "failed",
      };
      sandboxLog(sandboxName, "cmd", "done", {
        ms: Date.now() - t0,
        exit: result.exitCode,
        success: result.success,
      });
      return result;
    } catch (error) {
      lastError = error;
      sandboxLog(sandboxName, "cmd", "error", {
        ms: Date.now() - t0,
        attempt: attempt + 1,
        error: error instanceof Error ? error.message : String(error),
      });
      if (attempt >= retries) break;
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new AppError("preview", "Sandbox command failed.", {
        detail: String(lastError),
      });
}

async function ensureSiteDeps(sandboxName: string): Promise<void> {
  const hasBinary = await runCommand(
    sandboxName,
    "test -x node_modules/.bin/astro || test -x node_modules/.bin/vite",
    { timeoutSeconds: 30, retries: 1 }
  );
  if (hasBinary.success && hasBinary.exitCode === 0) {
    sandboxLog(sandboxName, "deps", "present");
    return;
  }

  sandboxLog(sandboxName, "deps", "install");
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
  const sandbox = await loadSandbox(sandboxName);
  const processes = await sandbox.process.list();
  const existing = processes.find((p) => p.name === DEV_PROCESS_NAME);
  if (existing?.status === "running") {
    sandboxLog(sandboxName, "dev", "already running");
    return;
  }
  if (existing) {
    try {
      await sandbox.process.kill(DEV_PROCESS_NAME);
    } catch {
      /* ignore */
    }
  }

  sandboxLog(sandboxName, "dev", "start");
  await sandbox.process.exec({
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
}

async function ensurePreviewUrl(sandboxName: string): Promise<string> {
  const sandbox = await loadSandbox(sandboxName);
  const preview = await sandbox.previews.createIfNotExists({
    metadata: { name: PREVIEW_NAME },
    spec: {
      port: PREVIEW_PORT,
      public: true,
      responseHeaders: PREVIEW_RESPONSE_HEADERS,
    },
  });
  const url = preview.spec?.url?.trim();
  if (!url || !/^https?:\/\//i.test(url)) {
    throw new AppError("preview", "Could not resolve public preview URL.", {
      detail: "Blaxel preview returned no URL",
    });
  }
  return url.replace(/\/$/, "");
}

export async function startPreview(sandboxName: string): Promise<string> {
  const t0 = Date.now();
  sandboxLog(sandboxName, "start", "begin");
  await ensureSandboxReady(sandboxName);
  await ensureSiteDeps(sandboxName);
  await ensureDevServer(sandboxName);
  const url = await ensurePreviewUrl(sandboxName);
  sandboxLog(sandboxName, "start", "complete", { url, ms: Date.now() - t0 });
  return url;
}

export async function restartPreview(sandboxName: string): Promise<string> {
  const t0 = Date.now();
  sandboxLog(sandboxName, "restart", "begin");
  await ensureSandboxReady(sandboxName);
  const sandbox = await loadSandbox(sandboxName);
  try {
    await sandbox.process.kill(DEV_PROCESS_NAME);
  } catch {
    /* ignore */
  }
  await ensureSiteDeps(sandboxName);
  await ensureDevServer(sandboxName);
  const url = await ensurePreviewUrl(sandboxName);
  sandboxLog(sandboxName, "restart", "complete", { url, ms: Date.now() - t0 });
  return url;
}

export async function stopSandbox(sandboxName: string): Promise<void> {
  const t0 = Date.now();
  sandboxLog(sandboxName, "stop", "begin");
  const sandbox = await loadSandbox(sandboxName);
  try {
    await sandbox.process.kill(DEV_PROCESS_NAME);
  } catch {
    /* ignore — may already be stopped */
  }
  sandboxLog(sandboxName, "stop", "dev stopped; sandbox left on standby", {
    ms: Date.now() - t0,
  });
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
    return body.length > 0;
  } catch {
    return false;
  }
}

export async function buildSite(sandboxName: string): Promise<void> {
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

const EXPORT_ZIP_PATH = "/tmp/.floras-export.zip";
const EXPORT_SCRIPT_PATH = "/tmp/.floras-export.py";

function exportZipScript(): string {
  return `import os
import sys
import zipfile

root = ${JSON.stringify(SITE_ROOT)}
out = ${JSON.stringify(EXPORT_ZIP_PATH)}
skip_dirs = {"node_modules", ".git", ".astro", "dist"}
skip_files = {".DS_Store"}

if not os.path.isdir(root):
    print("site directory missing", file=sys.stderr)
    sys.exit(1)

with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zf:
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [
            d for d in dirnames
            if d not in skip_dirs and not d.startswith(".floras-")
        ]
        for name in filenames:
            if name in skip_files or name.startswith(".floras-"):
                continue
            full = os.path.join(dirpath, name)
            arc = os.path.relpath(full, root)
            zf.write(full, arc)
print("ok")
`;
}

export async function exportSiteZip(sandboxName: string): Promise<Blob> {
  await ensureSandboxReady(sandboxName);
  const sandbox = await loadSandbox(sandboxName);

  await runCommand(
    sandboxName,
    `rm -f ${shellQuote(EXPORT_ZIP_PATH)} ${shellQuote(EXPORT_SCRIPT_PATH)}`,
    { cwd: "/", timeoutSeconds: 30 }
  );
  await sandbox.fs.write(EXPORT_SCRIPT_PATH, exportZipScript());

  try {
    const zip = await runCommand(
      sandboxName,
      `python3 ${shellQuote(EXPORT_SCRIPT_PATH)}`,
      { cwd: "/", timeoutSeconds: 180 }
    );
    if (!zip.success || zip.exitCode !== 0) {
      throw new AppError("unknown", "Couldn't create the project zip.", {
        detail: zip.stderr || zip.stdout || `exit ${zip.exitCode}`,
      });
    }
    return await sandbox.fs.readBinary(EXPORT_ZIP_PATH);
  } finally {
    await runCommand(
      sandboxName,
      `rm -f ${shellQuote(EXPORT_ZIP_PATH)} ${shellQuote(EXPORT_SCRIPT_PATH)}`,
      { cwd: "/", timeoutSeconds: 30 }
    ).catch((error) => {
      console.error("[sandbox] export zip cleanup failed", error);
    });
  }
}

export async function scrubCfEnv(
  sandboxName: string,
  envPath?: string
): Promise<void> {
  if (envPath) {
    await runCommand(sandboxName, `rm -f ${shellQuote(envPath)}`, {
      cwd: "/",
      timeoutSeconds: 30,
    });
    return;
  }
  await runCommand(sandboxName, "rm -f /tmp/.floras-cf-*.env", {
    cwd: "/",
    timeoutSeconds: 30,
  });
}

export async function deployDistWithWrangler(
  sandboxName: string,
  creds: WranglerDeployCreds
): Promise<void> {
  const envPath = cfEnvPath(sandboxName);
  try {
    const sandbox = await loadSandbox(sandboxName);
    await sandbox.fs.write(
      envPath,
      [
        `CLOUDFLARE_API_TOKEN=${creds.apiToken}`,
        `CLOUDFLARE_ACCOUNT_ID=${creds.accountId}`,
        "",
      ].join("\n")
    );
    const res = await runCommand(
      sandboxName,
      `set -a && . ${shellQuote(envPath)} && set +a && (command -v pnpm >/dev/null 2>&1 && pnpm dlx wrangler@4 pages deploy dist --project-name=${shellQuote(creds.projectName)} --commit-dirty=true || npx --yes wrangler@4 pages deploy dist --project-name=${shellQuote(creds.projectName)} --commit-dirty=true)`,
      { timeoutSeconds: 300 }
    );
    if (!res.success || res.exitCode !== 0) {
      throw new AppError("publish", "Deploy to Cloudflare failed.", {
        detail: res.stderr || res.stdout || `exit ${res.exitCode}`,
      });
    }
  } finally {
    await scrubCfEnv(sandboxName, envPath).catch((error) => {
      console.error("[sandbox] scrubCfEnv failed", error);
    });
  }
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}
