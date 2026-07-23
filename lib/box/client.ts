import {
  BoxApi,
  BoxStateEnum,
  Configuration,
  waitUntilReady,
} from "@asciidev/box-sdk";
import type { ScaffoldFile } from "@/lib/astro/scaffold";
import { getPreviewPort } from "@/lib/astro/scaffold";
import { AppError } from "@/lib/errors";

/**
 * Thin wrapper around the Box (box.ascii.dev) sandbox provider. All generated
 * Astro projects live in the `site/` working directory inside a Box, and are
 * served on a stable public HTTPS URL via the in-box `host` command.
 */

const SITE_DIR = "site";
const CF_ENV_PATH = "floras-cf.env";

export type BoxState = (typeof BoxStateEnum)[keyof typeof BoxStateEnum];

export function boxConfigured(): boolean {
  return Boolean(process.env.BOX_API_KEY);
}

export function getBox(): BoxApi {
  const accessToken = process.env.BOX_API_KEY;
  if (!accessToken) {
    throw new Error("BOX_API_KEY is not set. Add it in the environment secrets.");
  }
  return new BoxApi(
    new Configuration({
      basePath: process.env.BOX_BASE_URL ?? "https://ascii.dev/api/box/v1",
      accessToken,
    })
  );
}

export async function createSandbox(name: string): Promise<string> {
  const box = getBox();
  const created = await box.create({
    createBoxRequest: { ttlSeconds: 3600, noEnv: true },
  });
  const boxId = created.box.id;
  await box.update({ boxId, updateBoxRequest: { name } });
  await waitUntilReady(box, boxId);
  return boxId;
}

export async function getBoxState(boxId: string): Promise<BoxState> {
  const box = getBox();
  const res = await box.get({ boxId });
  return res.box.state;
}

export async function ensureBoxReady(boxId: string): Promise<void> {
  const box = getBox();
  const state = await getBoxState(boxId);

  switch (state) {
    case BoxStateEnum.Ready:
    case BoxStateEnum.Idle:
    case BoxStateEnum.Running:
      return;
    case BoxStateEnum.Archived:
    case BoxStateEnum.Archiving:
      await box.resume({ boxId, resumeRequest: { noEnv: true } });
      await waitUntilReady(box, boxId);
      return;
    case BoxStateEnum.Init:
    case BoxStateEnum.Provisioning:
    case BoxStateEnum.Provisioned:
    case BoxStateEnum.Cloning:
      await waitUntilReady(box, boxId);
      return;
    case BoxStateEnum.Error:
      throw new AppError("preview", "Sandbox is in an error state.", {
        detail: `box ${boxId} state=error`,
      });
    default: {
      const _exhaustive: never = state;
      throw new AppError("preview", "Unknown sandbox state.", {
        detail: `box ${boxId} state=${String(_exhaustive)}`,
      });
    }
  }
}

export async function writeFiles(boxId: string, files: ScaffoldFile[]): Promise<void> {
  const box = getBox();
  for (const file of files) {
    await box.writeFile({
      boxId,
      fileWriteRequest: {
        path: `${SITE_DIR}/${file.path}`,
        content: file.content,
        encoding: "utf8",
      },
    });
  }
}

export async function readFile(boxId: string, path: string): Promise<string> {
  const box = getBox();
  const res = await box.readFile({
    boxId,
    path: `${SITE_DIR}/${path}`,
    encoding: "utf8",
  });
  return res.content ?? "";
}

export interface CommandResult {
  exitCode: number | null | undefined;
  stdout: string;
  stderr: string;
  success: boolean;
}

export async function runCommand(
  boxId: string,
  command: string,
  opts: { cwd?: string; timeoutSeconds?: number } = {}
): Promise<CommandResult> {
  const box = getBox();
  const res = await box.command({
    boxId,
    commandRequest: {
      command,
      cwd: opts.cwd ?? SITE_DIR,
      timeoutSeconds: opts.timeoutSeconds ?? 120,
    },
  });
  return {
    exitCode: res.exitCode,
    stdout: res.stdout ?? "",
    stderr: res.stderr ?? "",
    success: Boolean(res.success),
  };
}

/**
 * Install dependencies, start the Astro dev server detached, and expose it on a
 * public HTTPS URL. Returns the preview URL.
 */
export async function startPreview(boxId: string): Promise<string> {
  const port = getPreviewPort();

  await runCommand(boxId, "npm install --no-audit --no-fund", {
    timeoutSeconds: 300,
  });

  // Start the dev server detached so the command returns immediately.
  await runCommand(
    boxId,
    "pkill -f 'astro dev' || true; nohup npm run dev > /tmp/astro-dev.log 2>&1 &",
    { timeoutSeconds: 30 }
  );

  // Give the dev server a moment to boot, then publish the port.
  await runCommand(boxId, "sleep 3", { cwd: ".", timeoutSeconds: 15 });

  const hosted = await runCommand(boxId, `host ${port} --public`, {
    cwd: ".",
    timeoutSeconds: 60,
  });

  const url = extractUrl(hosted.stdout) ?? extractUrl(hosted.stderr);
  if (!url) {
    throw new Error(
      `Could not determine preview URL from host output: ${hosted.stdout} ${hosted.stderr}`
    );
  }
  return url;
}

export async function restartPreview(boxId: string): Promise<void> {
  await runCommand(
    boxId,
    "pkill -f 'astro dev' || true; nohup npm run dev > /tmp/astro-dev.log 2>&1 &",
    { timeoutSeconds: 30 }
  );
}

export async function stopSandbox(boxId: string): Promise<void> {
  const box = getBox();
  await box.stop({ boxId });
}

export async function buildSite(boxId: string): Promise<void> {
  const res = await runCommand(boxId, "npm run build", { timeoutSeconds: 300 });
  if (!res.success || res.exitCode !== 0) {
    throw new AppError("publish", "Site build failed.", {
      detail: res.stderr || res.stdout || `exit ${res.exitCode}`,
    });
  }
}

export async function assertDistPresent(boxId: string): Promise<void> {
  const res = await runCommand(boxId, "test -f dist/index.html");
  if (!res.success || res.exitCode !== 0) {
    throw new AppError("publish", "Build output is missing.", {
      detail: "dist/index.html not found after build",
    });
  }
}

export type WranglerDeployCreds = {
  apiToken: string;
  accountId: string;
  projectName: string;
};

async function writeCfEnvFile(
  boxId: string,
  creds: Pick<WranglerDeployCreds, "apiToken" | "accountId">
): Promise<void> {
  const box = getBox();
  const content = [
    `CLOUDFLARE_API_TOKEN=${creds.apiToken}`,
    `CLOUDFLARE_ACCOUNT_ID=${creds.accountId}`,
    "",
  ].join("\n");
  await box.writeFile({
    boxId,
    fileWriteRequest: {
      path: CF_ENV_PATH,
      content,
      encoding: "utf8",
    },
  });
}

export async function scrubCfEnv(boxId: string): Promise<void> {
  await runCommand(boxId, `rm -f ../${CF_ENV_PATH} ${CF_ENV_PATH}`, {
    cwd: SITE_DIR,
    timeoutSeconds: 30,
  });
}

export async function deployDistWithWrangler(
  boxId: string,
  creds: WranglerDeployCreds
): Promise<void> {
  await writeCfEnvFile(boxId, creds);
  try {
    const res = await runCommand(
      boxId,
      `set -a && . ../${CF_ENV_PATH} && set +a && npx --yes wrangler@4 pages deploy dist --project-name=${shellQuote(creds.projectName)} --commit-dirty=true`,
      { timeoutSeconds: 300 }
    );
    if (!res.success || res.exitCode !== 0) {
      throw new AppError("publish", "Deploy to Cloudflare failed.", {
        detail: res.stderr || res.stdout || `exit ${res.exitCode}`,
      });
    }
  } finally {
    await scrubCfEnv(boxId);
  }
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function extractUrl(text: string): string | undefined {
  const match = text.match(/https:\/\/[^\s"']+on\.ascii\.dev[^\s"']*/);
  return match?.[0];
}
