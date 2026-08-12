import { createWriteStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import {
  getFilesystemByPath,
  settings,
  type SandboxInstance,
} from "@blaxel/core";
import { AppError } from "@/lib/errors";

function sandboxBaseUrl(sandbox: SandboxInstance): string {
  const url = sandbox.metadata.url;
  if (url) return url.replace(/\/$/, "");
  return `${settings.runUrl}/${settings.workspace}/sandboxes/${sandbox.metadata.name}`;
}

export async function streamSandboxFileToPath(
  sandbox: SandboxInstance,
  remotePath: string,
  localPath: string
): Promise<void> {
  const { response, error } = await getFilesystemByPath({
    path: { path: remotePath },
    baseUrl: sandboxBaseUrl(sandbox),
    headers: {
      ...settings.headers,
      Accept: "application/octet-stream",
    },
    parseAs: "stream",
  });

  if (!response.ok || error) {
    const detail =
      error && typeof error === "object" && "error" in error
        ? String(error.error)
        : `HTTP ${response.status}`;
    throw new AppError("publish", "Couldn't download the build output.", {
      detail,
    });
  }

  const stream = response.body;
  if (!stream) {
    throw new AppError("publish", "Build output stream is invalid.");
  }

  await pipeline(
    Readable.fromWeb(
      stream as import("node:stream/web").ReadableStream<Uint8Array>
    ),
    createWriteStream(localPath)
  );

  const info = await stat(localPath);
  if (info.size === 0) {
    throw new AppError("publish", "Build output package is empty.");
  }
}
