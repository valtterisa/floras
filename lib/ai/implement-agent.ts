import { ToolLoopAgent, isStepCount, tool, type LanguageModel } from "ai";
import { z } from "zod";
import * as sandboxClient from "@/lib/sandbox/client";
import type { SandboxSession } from "@/lib/sandbox/session";
import { anthropicThinkingOptions } from "@/lib/ai/anthropic-options";
import { AppError } from "@/lib/errors";
import {
  assertAllowedCommand,
  assertSafeSitePath,
  detectGeneratedSite,
  listSiteFiles,
  type AgentStep,
} from "@/lib/ai/agent-shared";
import {
  createLoadDesignSkillTool,
  createRecallDesignBriefTool,
} from "@/lib/ai/skills/tools";
import {
  connectCustomDomain,
  disconnectCustomDomain,
  getCustomDomain,
} from "@/lib/publish/run-domain";

const IMPLEMENT_INSTRUCTIONS = `You are Floras implementer. Edit the sandbox project in place (src/, public/, package.json). Astro + Tailwind v4 + CSS only. Never restart Astro manually.

Call inspect_site first.
- New / redesign with a plan: load_design_skill once, ensure_sandbox, then write the plan.
- Edits: recall_design_brief (not load_design_skill). ensure_sandbox if needed. Keep scope tight.
- Blank/502 preview: read_preview_logs and fix.

Follow any authoritative build plan in the prompt. End with 1–3 short sentences.
`;

export type ImplementAgentOptions = {
  sandbox: SandboxSession;
  projectId: string;
  token: string;
  customerId: string;
  model: LanguageModel;
  onStep: (step: AgentStep) => Promise<void> | void;
  hasPreview: boolean;
  previewUrl?: string | null;
  projectName?: string;
  customInstructions?: string;
  formPublicKey?: string;
  formsSubmitUrl?: string;
  loadDesignBrief: () => Promise<string | null>;
  loadPlanMarkdown: () => Promise<string | null>;
};

export function buildImplementAgent(opts: ImplementAgentOptions) {
  const { sandbox, projectId, token, customerId, onStep } = opts;

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
    description: "Call first. Reports new vs edit mode and plan presence.",
    inputSchema: z.object({}),
    execute: async () => {
      const sandboxName = sandbox.currentSandboxName();
      const planMarkdown = await opts.loadPlanMarkdown();
      const known = opts.hasPreview || Boolean(planMarkdown);

      if (!sandboxName) {
        await onStep({
          kind: "inspect",
          label: known ? "Existing project, no sandbox" : "New site session",
        });
        return {
          mode: known ? ("edit" as const) : ("new" as const),
          sandboxReady: false,
          hasStoredPlan: Boolean(planMarkdown),
          previewUrl: opts.previewUrl ?? null,
          next: known
            ? "ensure_sandbox if needed, then edit with design brief."
            : "ensure_sandbox, then implement the stored plan.",
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
        known || generatedOnDisk ? ("edit" as const) : ("new" as const);

      await onStep({
        kind: "inspect",
        label: mode === "edit" ? "Existing site detected" : "New site session",
        detail: `${files.length} files`,
      });

      return {
        mode,
        sandboxReady: true,
        hasStoredPlan: Boolean(planMarkdown),
        previewUrl: opts.previewUrl ?? null,
        fileCount: files.length,
        files: files.slice(0, 80),
        next:
          mode === "edit"
            ? "recall_design_brief then apply scoped edits."
            : "load_design_skill then ensure_sandbox and build.",
      };
    },
  });

  const ensure_sandbox = tool({
    description:
      "Create or resume the sandbox and live preview. Required before write_file on new builds.",
    inputSchema: z.object({}),
    execute: async () => {
      await onStep({
        kind: "sandbox",
        label: sandbox.isProvisioned() ? "Resuming sandbox" : "Creating sandbox",
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
      return { status: "ready" as const, sandboxName, previewUrl };
    },
  });

  const formBlock =
    opts.formPublicKey && opts.formsSubmitUrl
      ? `\n\nFORMS\nFORM_PUBLIC_KEY=${opts.formPublicKey}\nFORMS_SUBMIT_URL=${opts.formsSubmitUrl}\n`
      : "";
  const custom = opts.customInstructions?.trim();
  const customBlock = custom
    ? `\n\nUSER CUSTOM INSTRUCTIONS\n${custom}`
    : "";

  return new ToolLoopAgent({
    model: opts.model,
    instructions: `${IMPLEMENT_INSTRUCTIONS}${formBlock}${customBlock}`,
    tools: {
      inspect_site,
      ensure_sandbox,
      load_design_skill: createLoadDesignSkillTool({ onStep }),
      recall_design_brief: createRecallDesignBriefTool({
        onStep,
        loadDesignBrief: opts.loadDesignBrief,
      }),
      write_file: tool({
        description: "Create or overwrite one file. Requires ensure_sandbox first on new sites.",
        inputSchema: z.object({ path: z.string(), content: z.string() }),
        execute: async ({ path, content }) => {
          const name = await requireSandbox();
          const safePath = assertSafeSitePath(path);
          await sandboxClient.writeFiles(name, [{ path: safePath, content }]);
          await onStep({ kind: "write", label: `Edited ${safePath}` });
          return { ok: true };
        },
      }),
      read_file: tool({
        description: "Read one file from the site project.",
        inputSchema: z.object({ path: z.string() }),
        execute: async ({ path }) => {
          const name = await requireSandbox();
          const safePath = assertSafeSitePath(path);
          const content = await sandboxClient.readFile(name, safePath);
          await onStep({ kind: "read", label: `Read ${safePath}` });
          return { content };
        },
      }),
      list_files: tool({
        description: "List project files.",
        inputSchema: z.object({}),
        execute: async () => {
          const name = await requireSandbox();
          const files = await listSiteFiles(name);
          await onStep({ kind: "command", label: "Listed project files" });
          return { files };
        },
      }),
      run_command: tool({
        description: "Allowlisted shell command in the site project.",
        inputSchema: z.object({ command: z.string() }),
        execute: async ({ command }) => {
          const name = await requireSandbox();
          const safe = assertAllowedCommand(command);
          const res = await sandboxClient.runCommand(name, safe, {
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
        description: "Connect a custom domain (published sites only).",
        inputSchema: z.object({ domain: z.string() }),
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
        description: "Refresh custom domain status.",
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
        description: "Disconnect the custom domain.",
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
        description: "Read Astro preview logs when preview is blank or failing.",
        inputSchema: z.object({}),
        execute: async () => {
          const name = await requireSandbox();
          const result = await sandboxClient.getDevProcessLogs(name);
          await onStep({
            kind: "command",
            label: result.found
              ? "Read preview console"
              : "Preview process not running",
          });
          return { found: result.found, logs: result.logs.slice(-12_000) };
        },
      }),
    },
    providerOptions: anthropicThinkingOptions("low"),
    stopWhen: isStepCount(40),
  });
}
