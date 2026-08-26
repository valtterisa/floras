import * as sandboxClient from "@/lib/sandbox/client";
import { assertSafeSiteRelativePath } from "@/lib/sandbox/config";
import { AppError } from "@/lib/errors";

export type AgentStepKind =
  | "plan"
  | "write"
  | "read"
  | "command"
  | "preview"
  | "domain"
  | "note"
  | "inspect"
  | "sandbox";

export interface AgentStep {
  kind: AgentStepKind;
  label: string;
  detail?: string;
}

export async function listSiteFiles(sandboxName: string): Promise<string[]> {
  const res = await sandboxClient.runCommand(
    sandboxName,
    "find . -type f -not -path './node_modules/*' -not -path './.astro/*' -not -path './.git/*' | sort"
  );
  return res.stdout.split("\n").filter(Boolean);
}

export function detectGeneratedSite(files: string[]): boolean {
  const pages = files.filter(
    (f) => f.includes("/src/pages/") && f.endsWith(".astro")
  );
  const components = files.filter(
    (f) => f.includes("/src/components/") && f.endsWith(".astro")
  );
  return pages.length > 1 || components.length > 0;
}

export async function sandboxLooksGenerated(
  sandboxName: string | null | undefined
): Promise<boolean> {
  if (!sandboxName) return false;
  try {
    return detectGeneratedSite(await listSiteFiles(sandboxName));
  } catch {
    return false;
  }
}

export function assertSafeSitePath(path: string): string {
  try {
    return assertSafeSiteRelativePath(path);
  } catch {
    throw new AppError("unknown", "Path must stay inside site/.");
  }
}

export function assertAllowedCommand(command: string): string {
  const trimmed = command.trim();
  if (!trimmed || trimmed.length > 500) {
    throw new AppError("unknown", "Command rejected.");
  }
  if (/[;&|`$(){}]|<<|>>|>|<|\n|\r|\$\(|\$\{/.test(trimmed)) {
    throw new AppError("unknown", "Command rejected: unsafe shell syntax.");
  }
  if (
    /\.\.|\/etc\/|\/proc\/|\/sys\/|environ|printenv|floras-cf|\.floras-cf|CLOUDFLARE_|AUTUMN_|ANTHROPIC_|BYOK_/i.test(
      trimmed
    )
  ) {
    throw new AppError("unknown", "Command rejected: forbidden path or secret.");
  }

  const allow =
    /^(pnpm\s+(add|remove|install|exec|run)\b|npm\s+(install|run)\b|ls\b|cat\b|head\b|tail\b|wc\b|find\b|test\b|pwd\b|echo\b|mkdir\b|cp\b|mv\b|rm\s+-f\b|rm\s+--\b|astro\b|tsc\b)/;
  if (!allow.test(trimmed)) {
    throw new AppError(
      "unknown",
      "Command not allowlisted. Use pnpm add/exec, ls, cat, or similar site tools."
    );
  }
  if (/^rm\b/.test(trimmed) && /(-rf|--no-preserve-root|\/)\b/.test(trimmed)) {
    throw new AppError("unknown", "Command rejected: destructive rm.");
  }
  if (/^find\b/.test(trimmed) && /(\/proc|\/sys|\/etc)\b/.test(trimmed)) {
    throw new AppError("unknown", "Command rejected: forbidden path.");
  }
  return trimmed;
}
