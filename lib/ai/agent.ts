import { ToolLoopAgent, isStepCount, tool } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { sitePlanSchema, type SitePlan } from "@/lib/schema/site";
import { scaffoldAstroProject } from "@/lib/astro/scaffold";
import * as box from "@/lib/box/client";
import { DESIGN_GUIDELINES } from "@/lib/ai/design-guidelines";
import { resolveAgentModelId } from "@/lib/ai/model";
import { anthropicThinkingOptions } from "@/lib/ai/anthropic-options";
import { withAutumnModel } from "@/lib/billing/with-autumn-model";

export type AgentStepKind =
  | "plan"
  | "write"
  | "read"
  | "command"
  | "preview"
  | "note";

export interface AgentStep {
  kind: AgentStepKind;
  label: string;
  detail?: string;
}

export interface BuildAgentOptions {
  boxId: string;
  onStep: (step: AgentStep) => Promise<void> | void;
  onPlan: (plan: SitePlan) => Promise<void> | void;
  onPreview: (url: string) => Promise<void> | void;
  hasPreview: boolean;
  customInstructions?: string;
  modelId?: string;
  customerId?: string;
}

function getModel(modelId?: string, customerId?: string) {
  const model = anthropic(resolveAgentModelId(modelId));
  if (!customerId) return model;
  return withAutumnModel(model, customerId);
}

const INSTRUCTIONS = `You are an expert Astro web engineer inside a Linux sandbox. You generate and edit beautiful, production-ready Astro sites (landing pages and blogs) that live in the "site/" project directory.

WORKFLOW (mandatory — three phases, in order)

PHASE 1 — PLAN
1. Apply Section 0 of the design skill: infer the brief, output a one-line Design Read.
2. Set DESIGN_VARIANCE / MOTION_INTENSITY / VISUAL_DENSITY from the skill (cap MOTION_INTENSITY at 3 because motion is CSS-only).
3. Call plan_site exactly once with a complete SitePlan that matches that read (font, theme, accent, varied section types, real imagePrompt seeds). Do not write files by hand before plan_site.

PHASE 2 — BUILD
4. After plan_site scaffolds the project and starts the preview, use write_file / read_file / list_files / run_command to finish the site: layout, copy, components, styling the scaffold did not fully capture.
5. Keep changes targeted. The dev server hot-reloads — never restart it manually.
6. Deliver complete file contents (no placeholders or "// ..."). Prefer editing files over explaining them.

PHASE 3 — DESIGN POLISH (required second pass)
7. When the site is functionally built, run a full design-skill pass: re-read key page and component files, then rewrite them to better satisfy the design skill — especially Section 4 (directives), Section 9 (AI tells), and Section 14 (pre-flight checklist).
8. Do not call plan_site again in this phase unless the scaffold is broken. Improve UI in place with write_file.
9. Only stop after Section 14 pre-flight can be honestly ticked (within Astro + CSS constraints). End with a one-paragraph summary of what you built and what the polish pass changed.

Never dump large explanations between tool calls.

${DESIGN_GUIDELINES}`;

export function buildSiteAgent(opts: BuildAgentOptions) {
  const { boxId, onStep, onPlan, onPreview } = opts;

  const tools = {
    plan_site: tool({
      description:
        "Scaffold or fully re-generate the Astro site from a structured plan, then start the live preview. Call once in PHASE 1 only.",
      inputSchema: sitePlanSchema,
      execute: async (plan) => {
        await onStep({
          kind: "plan",
          label: `Planned "${plan.siteName}"`,
          detail: `${plan.pages.length} page(s)`,
        });
        const files = scaffoldAstroProject(plan as SitePlan);
        await box.writeFiles(boxId, files);
        await onPlan(plan as SitePlan);
        await onStep({ kind: "write", label: `Scaffolded ${files.length} files` });
        const url = await box.startPreview(boxId);
        await onPreview(url);
        await onStep({ kind: "preview", label: "Live preview ready", detail: url });
        return {
          ok: true,
          files: files.map((f) => f.path),
          previewUrl: url,
        };
      },
    }),

    write_file: tool({
      description: "Create or overwrite one file in the site project.",
      inputSchema: z.object({
        path: z
          .string()
          .describe("Path relative to the site root, e.g. src/components/Hero.astro"),
        content: z.string(),
      }),
      execute: async ({ path, content }) => {
        await box.writeFiles(boxId, [{ path, content }]);
        await onStep({ kind: "write", label: `Edited ${path}` });
        return { ok: true };
      },
    }),

    read_file: tool({
      description: "Read one file from the site project.",
      inputSchema: z.object({ path: z.string() }),
      execute: async ({ path }) => {
        const content = await box.readFile(boxId, path);
        await onStep({ kind: "read", label: `Read ${path}` });
        return { content };
      },
    }),

    list_files: tool({
      description: "List the files in the site project.",
      inputSchema: z.object({}),
      execute: async () => {
        const res = await box.runCommand(
          boxId,
          "find . -type f -not -path './node_modules/*' -not -path './.astro/*' | sort"
        );
        await onStep({ kind: "command", label: "Listed project files" });
        return { files: res.stdout.split("\n").filter(Boolean) };
      },
    }),

    run_command: tool({
      description: "Run a short shell command in the site project (e.g. install a package).",
      inputSchema: z.object({ command: z.string() }),
      execute: async ({ command }) => {
        const res = await box.runCommand(boxId, command, { timeoutSeconds: 120 });
        await onStep({
          kind: "command",
          label: command,
          detail: res.stderr || undefined,
        });
        return {
          exitCode: res.exitCode,
          stdout: res.stdout.slice(0, 4000),
          stderr: res.stderr.slice(0, 2000),
        };
      },
    }),
  };

  const custom = opts.customInstructions?.trim();
  const instructions = custom
    ? `${INSTRUCTIONS}

USER CUSTOM INSTRUCTIONS
Honor these preferences when they do not conflict with safety, scaffold constraints, or the design skill above:
${custom}`
    : INSTRUCTIONS;

  return new ToolLoopAgent({
    model: getModel(opts.modelId, opts.customerId),
    instructions,
    tools,
    providerOptions: anthropicThinkingOptions("low"),
    stopWhen: isStepCount(40),
  });
}
