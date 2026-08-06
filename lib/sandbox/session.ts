import * as sandbox from "@/lib/sandbox/client";
import { sandboxNameForProject } from "@/lib/sandbox/config";
import { AppError } from "@/lib/errors";

export type SandboxSessionOptions = {
  projectId: string;
  projectName: string;
  token: string;
  initialSandboxName?: string;
  initialPreviewUrl?: string | null;
  onSandbox: (info: { sandboxName: string }) => Promise<void>;
  onPreview: (url: string) => Promise<void>;
  onStatus?: (status: "provisioning" | "generating") => Promise<void>;
};

export type SandboxSession = {
  currentSandboxName: () => string | undefined;
  currentPreviewUrl: () => string | null;
  isProvisioned: () => boolean;
  ensureReady: () => Promise<string>;
  ensurePreview: (opts?: { force?: boolean }) => Promise<string | null>;
};

export function createSandboxSession(
  opts: SandboxSessionOptions
): SandboxSession {
  let sandboxName = opts.initialSandboxName?.trim() || undefined;
  let previewUrl = opts.initialPreviewUrl?.trim() || null;
  let readyPromise: Promise<string> | null = null;
  let previewPromise: Promise<string> | null = null;
  const preferredName = sandboxNameForProject(opts.projectId);
  const persistence = {
    projectId: opts.projectId,
    token: opts.token,
  };

  function ensureReady(): Promise<string> {
    if (readyPromise) return readyPromise;

    readyPromise = (async () => {
      if (sandboxName) {
        await sandbox.ensureSandboxReady(sandboxName, persistence);
        return sandboxName;
      }

      if (!sandbox.sandboxConfigured()) {
        throw new AppError("config");
      }

      await opts.onStatus?.("provisioning");
      const created = await sandbox.createOrResumeSandbox({
        sandboxName: preferredName,
        displayName: opts.projectName,
        persistence,
      });
      sandboxName = created.sandboxName;
      await opts.onSandbox(created);
      await opts.onStatus?.("generating");
      return created.sandboxName;
    })().catch((error) => {
      readyPromise = null;
      throw error;
    });

    return readyPromise;
  }

  async function ensurePreview(previewOpts?: {
    force?: boolean;
  }): Promise<string | null> {
    const name = await ensureReady();
    if (!previewOpts?.force && previewUrl) return previewUrl;
    if (!previewOpts?.force && previewPromise) return previewPromise;

    previewPromise = (async () => {
      const url = await sandbox.startPreview(name, persistence);
      previewUrl = url;
      await opts.onPreview(url);
      return url;
    })().catch((error) => {
      previewPromise = null;
      throw error;
    });

    return previewPromise;
  }

  return {
    currentSandboxName: () => sandboxName,
    currentPreviewUrl: () => previewUrl,
    isProvisioned: () => Boolean(sandboxName),
    ensureReady,
    ensurePreview,
  };
}
