import { ToolLoopAgent, isStepCount, tool, type LanguageModel } from "ai";
import { z } from "zod";
import { sitePlanSchema, type SitePlan } from "@/lib/schema/site";
import * as sandboxClient from "@/lib/sandbox/client";
import { assertSafeSiteRelativePath } from "@/lib/sandbox/config";
import type { SandboxSession } from "@/lib/sandbox/session";
import { DESIGN_SKILL } from "@/lib/ai/design-skill";
import { anthropicThinkingOptions } from "@/lib/ai/anthropic-options";
import { AppError } from "@/lib/errors";
import {
  connectCustomDomain,
  disconnectCustomDomain,
  getCustomDomain,
} from "@/lib/publish/run-domain";

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

export interface BuildAgentOptions {
  sandbox: SandboxSession;
  projectId: string;
  token: string;
  customerId: string;
  onStep: (step: AgentStep) => Promise<void> | void;
  onPlan: (plan: SitePlan) => Promise<void> | void;
  hasPreview: boolean;
  sitePlan?: SitePlan | null;
  previewUrl?: string | null;
  projectName?: string;
  customInstructions?: string;
  model: LanguageModel;
  formPublicKey?: string;
  formsSubmitUrl?: string;
}

function siteAlreadyKnown(opts: BuildAgentOptions): boolean {
  return opts.hasPreview || Boolean(opts.sitePlan);
}

async function listSiteFiles(sandboxName: string): Promise<string[]> {
  const res = await sandboxClient.runCommand(
    sandboxName,
    "find . -type f -not -path './node_modules/*' -not -path './.astro/*' -not -path './.git/*' | sort"
  );
  return res.stdout.split("\n").filter(Boolean);
}

function detectGeneratedSite(files: string[]): boolean {
  const pages = files.filter(
    (f) => f.includes("/src/pages/") && f.endsWith(".astro")
  );
  const components = files.filter(
    (f) => f.includes("/src/components/") && f.endsWith(".astro")
  );
  return pages.length > 1 || components.length > 0;
}

function assertSafeSitePath(path: string): string {
  try {
    return assertSafeSiteRelativePath(path);
  } catch {
    throw new AppError("unknown", "Path must stay inside site/.");
  }
}

function assertAllowedCommand(command: string): string {
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

const INSTRUCTIONS = `You are an expert Astro web engineer. Sites live in the sandbox project root (paths like src/, public/, package.json). Edit in place. Do not recreate package.json or reinstall the framework unless something is broken. Never restart the Astro dev server manually.

If the live preview is blank, 502, or failing to boot, call read_preview_logs and fix the reported Astro/build errors.

FIRST TOOL CALL (mandatory)
Call inspect_site before any other tool. Follow the returned mode exactly:
- mode "edit": the site already exists. Make the user's requested changes with read_file / write_file. Do not ask to build. Do not claim there is no live project.
- mode "new": this is a first build. Call plan_site once, then ensure_sandbox, then implement and polish.

NEW SITE (mode "new")
1. Design Read + variance settings from the design skill.
2. plan_site exactly once (stores the plan only — no sandbox required).
3. Call ensure_sandbox once. Wait for it to return ready, then write files.
4. Implement with write_file / read_file / list_files.
5. Design polish pass, then a short markdown summary.

EDIT SITE (mode "edit")
1. If inspect_site says sandboxReady is false, call ensure_sandbox first.
2. Read the files you need.
3. Apply targeted write_file changes (complete file contents).
4. Keep scope tight unless the user asks for a redesign.
5. Short markdown summary of what changed.

SANDBOX
ensure_sandbox creates or resumes the Box VM and starts the live preview.
- New sites: call after plan_site, before the first write_file.
- If the user asks to start, resume, wake, or spin up the sandbox/preview/box (dev convenience), call ensure_sandbox after inspect_site and confirm briefly. Do not redesign or edit files unless they also asked for that.
- Do not call it more than once per turn unless it failed.

CUSTOM DOMAINS
Use setup_domain / check_domain / remove_domain when asked. Site must already be published. List real DNS records only.

Never dump large explanations between tool calls. Do not narrate before or between tool calls — save user-facing text for one short markdown summary after tools finish.
Separate paragraphs with a blank line. Do not hard-wrap or insert line breaks mid-sentence.

CONTACT / LOCAL BUSINESS
For local businesses, service trades, restaurants, salons, clinics, and any brief that wants contact or bookings: include a \`contact\` section in plan_site and implement a working Floras-backed form (see design skill). Do not use mailto as the only contact path.

${DESIGN_SKILL}`;

function buildInstructions(opts: BuildAgentOptions): string {
  const custom = opts.customInstructions?.trim();
  const customBlock = custom
    ? `

USER CUSTOM INSTRUCTIONS
Honor these preferences in every reply (including how you address the user) when they do not conflict with safety or the design skill above:
${custom}`
    : "";

  const formBlock =
    opts.formPublicKey && opts.formsSubmitUrl
      ? `

FORMS (wire contact sections to these exact values)
FORM_PUBLIC_KEY=${opts.formPublicKey}
FORMS_SUBMIT_URL=${opts.formsSubmitUrl}
Use these when implementing contact forms. Do not invent other endpoints.`
      : "";

  return `${INSTRUCTIONS}${formBlock}${customBlock}`;
}

export function buildSiteAgent(opts: BuildAgentOptions) {
  const { sandbox, projectId, token, customerId, onStep, onPlan } = opts;
  const knownExisting = siteAlreadyKnown(opts);

  const requireSandbox = async (): Promise<string> => {
    if (sandbox.isProvisioned()) {
      return sandbox.ensureReady();
    }
    throw new AppError(
      "preview",
      "Sandbox is not ready. Call ensure_sandbox before reading or writing files."
    );
  };

  const inspect_site = tool({
    description:
      "Call first on every turn. Inspects site/ when a sandbox exists, otherwise reports a new-site session.",
    inputSchema: z.object({}),
    execute: async () => {
      const sandboxName = sandbox.currentSandboxName();
      if (!sandboxName) {
        await onStep({
          kind: "inspect",
          label: "New site session",
          detail: "Sandbox not provisioned yet",
        });
        return {
          mode: "new" as const,
          sandboxReady: false,
          projectName: opts.projectName?.trim() || null,
          siteName: opts.sitePlan?.siteName ?? null,
          previewUrl: opts.previewUrl ?? null,
          hasStoredPlan: Boolean(opts.sitePlan),
          fileCount: 0,
          files: [] as string[],
          next: "Call plan_site once, then ensure_sandbox, then build and polish.",
        };
      }

      let files: string[] = [];
      let generatedOnDisk = false;
      try {
        await sandbox.ensureReady();
        files = await listSiteFiles(sandboxName);
        generatedOnDisk = detectGeneratedSite(files);
      } catch {
        files = [];
      }

      const mode =
        knownExisting || generatedOnDisk ? ("edit" as const) : ("new" as const);

      await onStep({
        kind: "inspect",
        label:
          mode === "edit" ? "Existing site detected" : "New site session",
        detail: `${files.length} files`,
      });

      return {
        mode,
        sandboxReady: true,
        projectName: opts.projectName?.trim() || null,
        siteName: opts.sitePlan?.siteName ?? null,
        previewUrl: opts.previewUrl ?? null,
        hasStoredPlan: Boolean(opts.sitePlan),
        fileCount: files.length,
        files: files.slice(0, 80),
        next:
          mode === "edit"
            ? "Edit site/ in place for the user request. Do not call plan_site."
            : "Call plan_site once, then ensure_sandbox, then build and polish.",
      };
    },
  });

  const ensure_sandbox = tool({
    description:
      "Create or resume the sandbox VM and start the live preview. Call after plan_site on new builds, or whenever the user asks to start/resume/wake the sandbox. Returns when ready for write_file.",
    inputSchema: z.object({}),
    execute: async () => {
      await onStep({
        kind: "sandbox",
        label: sandbox.isProvisioned()
          ? "Resuming sandbox"
          : "Creating sandbox",
      });

      const sandboxName = await sandbox.ensureReady();
      const previewUrl = await sandbox.ensurePreview({ force: true });
      if (previewUrl) {
        await onStep({
          kind: "preview",
          label: "Preview URL live",
          detail: previewUrl,
        });
      }

      await onStep({
        kind: "sandbox",
        label: "Sandbox ready",
        detail: sandboxName,
      });

      return {
        status: "ready" as const,
        sandboxName,
        previewUrl,
        next: "Sandbox is running. Continue with write_file if building, or stop if the user only asked to start it.",
      };
    },
  });

  const sharedTools = {
    inspect_site,
    ensure_sandbox,
    write_file: tool({
      description: "Create or overwrite one file in the site project. Requires ensure_sandbox first on new sites.",
      inputSchema: z.object({
        path: z
          .string()
          .describe("Path relative to the site root, e.g. src/components/Hero.astro"),
        content: z.string(),
      }),
      execute: async ({ path, content }) => {
        const sandboxName = await requireSandbox();
        const safePath = assertSafeSitePath(path);
        await sandboxClient.writeFiles(sandboxName, [{ path: safePath, content }]);
        await onStep({ kind: "write", label: `Edited ${safePath}` });
        return { ok: true };
      },
    }),
    read_file: tool({
      description: "Read one file from the site project. Requires ensure_sandbox first on new sites.",
      inputSchema: z.object({ path: z.string() }),
      execute: async ({ path }) => {
        const sandboxName = await requireSandbox();
        const safePath = assertSafeSitePath(path);
        const content = await sandboxClient.readFile(sandboxName, safePath);
        await onStep({ kind: "read", label: `Read ${safePath}` });
        return { content };
      },
    }),
    list_files: tool({
      description: "List the files in the site project. Requires ensure_sandbox first on new sites.",
      inputSchema: z.object({}),
      execute: async () => {
        const sandboxName = await requireSandbox();
        const files = await listSiteFiles(sandboxName);
        await onStep({ kind: "command", label: "Listed project files" });
        return { files };
      },
    }),
    run_command: tool({
      description:
        "Run an allowlisted shell command in the site project (pnpm add/exec, ls, cat, etc.).",
      inputSchema: z.object({ command: z.string() }),
      execute: async ({ command }) => {
        const sandboxName = await requireSandbox();
        const safe = assertAllowedCommand(command);
        const res = await sandboxClient.runCommand(sandboxName, safe, {
          timeoutSeconds: 120,
        });
        await onStep({
          kind: "command",
          label: safe,
          detail: res.stderr || undefined,
        });
        return {
          exitCode: res.exitCode,
          stdout: res.stdout.slice(0, 4000),
          stderr: res.stderr.slice(0, 2000),
        };
      },
    }),
    setup_domain: tool({
      description:
        "Connect a custom domain to the published site and return DNS records the user must add. Requires the site to already be published.",
      inputSchema: z.object({
        domain: z
          .string()
          .describe("Hostname to connect, e.g. www.example.com"),
      }),
      execute: async ({ domain }) => {
        const result = await connectCustomDomain(
          projectId,
          domain,
          token,
          customerId
        );
        await onStep({
          kind: "domain",
          label: `Connected ${result.domain?.name ?? domain}`,
          detail: result.domain?.status,
        });
        return {
          ok: true,
          publishedUrl: result.publishedUrl,
          domain: result.domain,
        };
      },
    }),
    check_domain: tool({
      description:
        "Refresh custom domain status and DNS records for this published site.",
      inputSchema: z.object({}),
      execute: async () => {
        const result = await getCustomDomain(projectId, token, customerId);
        await onStep({
          kind: "domain",
          label: result.domain
            ? `Domain ${result.domain.name}: ${result.domain.status}`
            : "No custom domain",
        });
        return {
          ok: true,
          publishedUrl: result.publishedUrl,
          domain: result.domain,
        };
      },
    }),
    remove_domain: tool({
      description:
        "Disconnect the custom domain from this site (does not change the user's DNS records).",
      inputSchema: z.object({}),
      execute: async () => {
        const result = await disconnectCustomDomain(
          projectId,
          token,
          customerId
        );
        await onStep({ kind: "domain", label: "Removed custom domain" });
        return {
          ok: true,
          publishedUrl: result.publishedUrl,
          domain: null,
        };
      },
    }),
    read_preview_logs: tool({
      description:
        "Read the Astro preview server (astro-dev) stdout/stderr. Use when the preview is blank, 502, or the site fails to start.",
      inputSchema: z.object({}),
      execute: async () => {
        const sandboxName = await requireSandbox();
        const result = await sandboxClient.getDevProcessLogs(sandboxName);
        await onStep({
          kind: "command",
          label: result.found
            ? "Read preview console"
            : "Preview process not running",
        });
        return {
          found: result.found,
          logs: result.logs.slice(-12_000),
        };
      },
    }),
  };

  const plan_site = tool({
    description:
      "Store the structured site plan. Only after inspect_site returns mode \"new\". Call once. Does not create the sandbox — call ensure_sandbox next.",
    inputSchema: sitePlanSchema,
    execute: async (plan) => {
      await onStep({
        kind: "plan",
        label: `Planned "${plan.siteName}"`,
        detail: `${plan.pages.length} page(s)`,
      });
      await onPlan(plan);
      return {
        ok: true,
        next: "Call ensure_sandbox, then implement with write_file.",
      };
    },
  });

  const tools = knownExisting
    ? sharedTools
    : { ...sharedTools, plan_site };

  return new ToolLoopAgent({
    model: opts.model,
    instructions: buildInstructions(opts),
    tools,
    providerOptions: anthropicThinkingOptions("low"),
    stopWhen: isStepCount(40),
  });
}
