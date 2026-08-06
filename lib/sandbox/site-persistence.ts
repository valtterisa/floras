import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { asProjectId } from "@/lib/convex/ids";
import * as sandbox from "@/lib/sandbox/client";
import { SITE_ROOT, sandboxLog } from "@/lib/sandbox/config";

const SNAPSHOT_TAR = "/tmp/.floras-site-snapshot.tar.gz";

function assertGzip(buf: Uint8Array, label: string): void {
  if (buf.byteLength < 24) {
    throw new Error(`${label}: archive too small (${buf.byteLength} bytes)`);
  }
  if (buf[0] !== 0x1f || buf[1] !== 0x8b) {
    throw new Error(
      `${label}: not gzip (got ${buf[0]?.toString(16)} ${buf[1]?.toString(16)}, ${buf.byteLength} bytes)`
    );
  }
}

export async function restoreSiteFromR2(
  sandboxName: string,
  projectId: string,
  token: string
): Promise<boolean> {
  const url = await fetchQuery(
    api.siteSnapshots.getSiteSnapshotUrl,
    { projectId: asProjectId(projectId) },
    { token }
  );
  if (!url) return false;

  sandboxLog(sandboxName, "r2", "restoring snapshot");
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`snapshot download failed (${res.status})`);
  }
  const buf = new Uint8Array(await res.arrayBuffer());
  assertGzip(buf, "downloaded snapshot");

  const instance = await sandbox.getSandboxInstance(sandboxName);
  await instance.fs.writeBinary(SNAPSHOT_TAR, buf);

  const extract = await sandbox.runCommand(
    sandboxName,
    [
      "set -euo pipefail",
      `ROOT=${shellQuote(SITE_ROOT)}`,
      `TAR=${shellQuote(SNAPSHOT_TAR)}`,
      'tar -tzf "$TAR" >/dev/null',
      'mkdir -p "$ROOT"',
      'find "$ROOT" -mindepth 1 -maxdepth 1 -exec rm -rf {} +',
      'tar -C "$ROOT" -xzf "$TAR"',
      'rm -f "$TAR"',
      'test -f "$ROOT/package.json"',
    ].join("\n"),
    { cwd: "/", timeoutSeconds: 180 }
  );

  if (!extract.success || extract.exitCode !== 0) {
    throw new Error(
      extract.stderr || extract.stdout || `snapshot extract failed (exit ${extract.exitCode})`
    );
  }

  sandboxLog(sandboxName, "r2", "restored", { bytes: buf.byteLength });
  return true;
}

export async function snapshotSiteToR2(
  sandboxName: string,
  projectId: string,
  token: string
): Promise<void> {
  const present = await sandbox.runCommand(
    sandboxName,
    `test -f ${shellQuote(`${SITE_ROOT}/package.json`)}`,
    { cwd: "/", timeoutSeconds: 30 }
  );
  if (!present.success || present.exitCode !== 0) {
    throw new Error("Site is not ready to snapshot");
  }

  await sandbox.runCommand(sandboxName, `rm -f ${shellQuote(SNAPSHOT_TAR)}`, {
    cwd: "/",
    timeoutSeconds: 30,
  });

  try {
    const pack = await sandbox.runCommand(
      sandboxName,
      [
        "set -euo pipefail",
        `ROOT=${shellQuote(SITE_ROOT)}`,
        `TAR=${shellQuote(SNAPSHOT_TAR)}`,
        'tar -C "$ROOT" -czf "$TAR" --exclude=node_modules --exclude=.git --exclude=.astro --exclude=dist --exclude=".floras-*" .',
        'tar -tzf "$TAR" >/dev/null',
        'test -s "$TAR"',
      ].join("\n"),
      { cwd: "/", timeoutSeconds: 180 }
    );
    if (!pack.success || pack.exitCode !== 0) {
      throw new Error(pack.stderr || pack.stdout || "tar failed");
    }

    const blob = await (
      await sandbox.getSandboxInstance(sandboxName)
    ).fs.readBinary(SNAPSHOT_TAR);
    const bytes = new Uint8Array(await blob.arrayBuffer());
    assertGzip(bytes, "packed snapshot");

    const { key, url } = await fetchMutation(
      api.siteSnapshots.prepareSiteSnapshotUpload,
      { projectId: asProjectId(projectId) },
      { token }
    );

    const upload = await fetch(url, {
      method: "PUT",
      body: bytes,
    });
    if (!upload.ok) {
      const detail = (await upload.text().catch(() => "")).slice(0, 500);
      throw new Error(
        `R2 upload failed (${upload.status})${detail ? `: ${detail}` : ""}`
      );
    }

    await fetchMutation(
      api.siteSnapshots.finalizeSiteSnapshot,
      { projectId: asProjectId(projectId), key },
      { token }
    );
    sandboxLog(sandboxName, "r2", "snapshot uploaded", {
      key,
      bytes: bytes.byteLength,
    });
  } finally {
    await sandbox
      .runCommand(sandboxName, `rm -f ${shellQuote(SNAPSHOT_TAR)}`, {
        cwd: "/",
        timeoutSeconds: 30,
      })
      .catch(() => undefined);
  }
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}
