import { createRequire } from "node:module";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { AppError } from "@/lib/errors";
import { getCloudflareConfig } from "@/lib/cloudflare/pages";

const execFileAsync = promisify(execFile);
const requireFromApp = createRequire(join(process.cwd(), "package.json"));

function wranglerEntry(): string {
  return join(
    dirname(requireFromApp.resolve("wrangler/package.json")),
    "bin/wrangler.js"
  );
}

export async function deployDistArchive(
  tarBytes: Uint8Array,
  projectName: string
): Promise<void> {
  const { apiToken, accountId } = getCloudflareConfig();
  const root = await mkdtemp(join(tmpdir(), "floras-pages-"));
  const tarPath = join(root, "dist.tar");

  try {
    await writeFile(tarPath, Buffer.from(tarBytes));
    await execFileAsync("tar", ["-xf", tarPath, "-C", root]);
    await rm(tarPath, { force: true });

    await execFileAsync(
      process.execPath,
      [
        wranglerEntry(),
        "pages",
        "deploy",
        root,
        `--project-name=${projectName}`,
        "--commit-dirty=true",
      ],
      {
        env: {
          ...process.env,
          CLOUDFLARE_API_TOKEN: apiToken,
          CLOUDFLARE_ACCOUNT_ID: accountId,
        },
        timeout: 280_000,
        maxBuffer: 8 * 1024 * 1024,
      }
    );
  } catch (error) {
    if (error instanceof AppError) throw error;
    const detail =
      error && typeof error === "object" && "stderr" in error
        ? String((error as { stderr: unknown }).stderr || "")
        : error instanceof Error
          ? error.message
          : String(error);
    throw new AppError("publish", "Deploy to Cloudflare failed.", { detail });
  } finally {
    await rm(root, { recursive: true, force: true }).catch(() => {});
  }
}
