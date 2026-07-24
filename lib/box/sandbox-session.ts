import * as box from "@/lib/box/client";
import { AppError } from "@/lib/errors";

export type SandboxSessionOptions = {
  projectName: string;
  initialBoxId?: string;
  initialSubdomain?: string;
  initialPreviewUrl?: string | null;
  onBox: (boxId: string, subdomain: string) => Promise<void>;
  onPreview: (url: string) => Promise<void>;
  onStatus?: (status: "provisioning" | "generating") => Promise<void>;
};

export type SandboxSession = {
  currentBoxId: () => string | undefined;
  currentPreviewUrl: () => string | null;
  isProvisioned: () => boolean;
  ensureReady: () => Promise<string>;
  ensurePreview: (opts?: { force?: boolean }) => Promise<string | null>;
};

export function createSandboxSession(
  opts: SandboxSessionOptions
): SandboxSession {
  let boxId = opts.initialBoxId?.trim() || undefined;
  let subdomain = opts.initialSubdomain?.trim() || undefined;
  let previewUrl = opts.initialPreviewUrl?.trim() || null;
  let readyPromise: Promise<string> | null = null;
  let previewPromise: Promise<string> | null = null;

  function ensureReady(): Promise<string> {
    if (readyPromise) return readyPromise;

    readyPromise = (async () => {
      if (boxId) {
        await box.ensureBoxReady(boxId);
        if (!subdomain) {
          subdomain = await box.getBoxSubdomain(boxId);
          await opts.onBox(boxId, subdomain);
        }
        return boxId;
      }

      if (!box.boxConfigured()) {
        throw new AppError("config");
      }

      await opts.onStatus?.("provisioning");
      const created = await box.createSandbox(opts.projectName);
      boxId = created.boxId;
      subdomain = created.subdomain;
      await opts.onBox(created.boxId, created.subdomain);
      await opts.onStatus?.("generating");
      return created.boxId;
    })().catch((error) => {
      readyPromise = null;
      throw error;
    });

    return readyPromise;
  }

  async function ensurePreview(previewOpts?: {
    force?: boolean;
  }): Promise<string | null> {
    const id = await ensureReady();
    if (!previewOpts?.force && previewUrl) return previewUrl;
    if (!previewOpts?.force && previewPromise) return previewPromise;

    previewPromise = (async () => {
      const url = await box.startPreview(id);
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
    currentBoxId: () => boxId,
    currentPreviewUrl: () => previewUrl,
    isProvisioned: () => Boolean(boxId),
    ensureReady,
    ensurePreview,
  };
}
