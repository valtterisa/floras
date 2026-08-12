import { createRequire } from "node:module";
import { access, readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { AppError } from "@/lib/errors";
import { getCloudflareConfig } from "@/lib/cloudflare/pages";

const execFileAsync = promisify(execFile);
const requireFromApp = createRequire(join(process.cwd(), "package.json"));

const ASTRO_ASSET_RE = /(?:href|src)="(\/_astro\/[^"]+)"/g;

const PAGES_NOT_FOUND_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Page not found</title>
</head>
<body>
  <h1>Page not found</h1>
</body>
</html>
`;

function wranglerEntry(): string {
  return join(
    dirname(requireFromApp.resolve("wrangler/package.json")),
    "bin/wrangler.js"
  );
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function prepareDistForPages(root: string): Promise<void> {
  const indexPath = join(root, "index.html");
  if (!(await pathExists(indexPath))) {
    throw new AppError("publish", "Build output is missing index.html.");
  }

  const astroDir = join(root, "_astro");
  if (!(await pathExists(astroDir))) {
    throw new AppError("publish", "Build output is missing the _astro assets folder.");
  }

  const html = await readFile(indexPath, "utf8");
  const assetRefs = [...html.matchAll(ASTRO_ASSET_RE)].map((match) => match[1]);
  for (const ref of assetRefs) {
    const assetPath = join(root, ref.slice(1));
    if (!(await pathExists(assetPath))) {
      throw new AppError("publish", "Build output is missing a referenced asset.", {
        detail: ref,
      });
    }
  }

  const notFoundPath = join(root, "404.html");
  if (!(await pathExists(notFoundPath))) {
    await writeFile(notFoundPath, PAGES_NOT_FOUND_HTML, "utf8");
  }
}

export async function deployDistArchive(
  tarPath: string,
  projectName: string
): Promise<void> {
  const { apiToken, accountId } = getCloudflareConfig();
  const root = await mkdtemp(join(tmpdir(), "floras-pages-"));

  try {
    await execFileAsync("tar", ["-xf", tarPath, "-C", root]);
    await prepareDistForPages(root);

    await execFileAsync(
      process.execPath,
      [
        wranglerEntry(),
        "pages",
        "deploy",
        root,
        `--project-name=${projectName}`,
        "--branch=main",
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
