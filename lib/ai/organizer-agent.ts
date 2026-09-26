import { ToolLoopAgent, isStepCount, tool, type LanguageModel } from "ai";
import { z } from "zod";
import type { SandboxSession } from "@/lib/sandbox/session";
import { anthropicThinkingOptions } from "@/lib/ai/anthropic-options";
import {
  sandboxLooksGenerated,
  type AgentStep,
} from "@/lib/ai/agent-shared";
import { buildPlanAgent } from "@/lib/ai/plan-agent";
import { buildImplementAgent } from "@/lib/ai/implement-agent";
import { createRecallDesignBriefTool } from "@/lib/ai/skills/tools";
import {
  formatRedesignAnswers,
  type RedesignAnswers,
} from "@/lib/schema/redesign";

const ORGANIZER_INSTRUCTIONS = `You coordinate Floras site builds. You do not write files yourself.

Tools: recall_project, recall_plan, recall_design_brief, request_redesign_intake, plan, implement.

Routing:
1. recall_project first.
2. NEW site (isNew): plan, then implement. Never request_redesign_intake.
3. SITE-WIDE redesign on existing site (whole site / start over / new look / rebrand):
   - redesignAnswersReady false → request_redesign_intake, then stop and ask the user to answer the dialog.
   - redesignAnswersReady true → plan, then implement.
4. SCOPED edits ("redesign the hero", copy, add section): implement only.
5. Ambiguous → implement only.
6. Wake/start sandbox only → implement with a narrow task.

Final reply after tools (short markdown only):
**Done.** <one sentence>

- <bullet>
- Preview: <url if known>
`;

export type OrganizerAgentOptions = {
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
  loadPlanMarkdown: () => Promise<string | null>;
  loadDesignBrief: () => Promise<string | null>;
  loadRedesignAnswers: () => Promise<RedesignAnswers | null>;
  persistPlan: (planMarkdown: string, designBrief: string) => Promise<void>;
  requestRedesignIntake: () => Promise<void>;
};

export function buildOrganizerAgent(opts: OrganizerAgentOptions) {
  const custom = opts.customInstructions?.trim();
  const instructions = custom
    ? `${ORGANIZER_INSTRUCTIONS}\n\nUSER CUSTOM INSTRUCTIONS\n${custom}`
    : ORGANIZER_INSTRUCTIONS;

  const planAgent = buildPlanAgent({
    model: opts.model,
    onStep: opts.onStep,
  });

  const implementAgent = buildImplementAgent({
    sandbox: opts.sandbox,
    projectId: opts.projectId,
    token: opts.token,
    customerId: opts.customerId,
    model: opts.model,
    onStep: opts.onStep,
    hasPreview: opts.hasPreview,
    previewUrl: opts.previewUrl,
    projectName: opts.projectName,
    customInstructions: opts.customInstructions,
    formPublicKey: opts.formPublicKey,
    formsSubmitUrl: opts.formsSubmitUrl,
    loadDesignBrief: opts.loadDesignBrief,
    loadPlanMarkdown: opts.loadPlanMarkdown,
  });

  return new ToolLoopAgent({
    model: opts.model,
    instructions,
    tools: {
      recall_project: tool({
        description: "Recall project status for routing.",
        inputSchema: z.object({}),
        execute: async () => {
          const [planMarkdown, designBrief, redesignAnswers, diskGenerated] =
            await Promise.all([
              opts.loadPlanMarkdown(),
              opts.loadDesignBrief(),
              opts.loadRedesignAnswers(),
              sandboxLooksGenerated(opts.sandbox.currentSandboxName()),
            ]);
          const isNew =
            !opts.hasPreview && !planMarkdown && !diskGenerated;
          await opts.onStep({
            kind: "note",
            label: isNew
              ? "Recalled project (new, no plan)"
              : "Recalled project (existing)",
          });
          return {
            projectName: opts.projectName ?? null,
            hasPreview: opts.hasPreview,
            previewUrl: opts.previewUrl ?? null,
            hasPlan: Boolean(planMarkdown),
            hasDesignBrief: Boolean(designBrief),
            redesignAnswersReady: Boolean(redesignAnswers),
            sandboxProvisioned: opts.sandbox.isProvisioned(),
            diskGenerated,
            isNew,
          };
        },
      }),

      recall_plan: tool({
        description: "Recall the stored markdown plan.",
        inputSchema: z.object({}),
        execute: async () => {
          const planMarkdown = await opts.loadPlanMarkdown();
          await opts.onStep({
            kind: "note",
            label: planMarkdown ? "Recalled plan" : "No plan stored",
          });
          return { planMarkdown };
        },
      }),

      recall_design_brief: createRecallDesignBriefTool({
        onStep: opts.onStep,
        loadDesignBrief: opts.loadDesignBrief,
      }),

      request_redesign_intake: tool({
        description:
          "Open redesign questions UI. Existing sites only, when redesign answers are missing. Do not call plan in the same turn.",
        inputSchema: z.object({}),
        execute: async () => {
          await opts.requestRedesignIntake();
          await opts.onStep({
            kind: "note",
            label: "Waiting for redesign answers",
          });
          return {
            ok: true as const,
            next: "Stop. Ask the user to answer the redesign dialog.",
          };
        },
      }),

      plan: tool({
        description:
          "Draft and persist markdown plan + design brief. Required before implement on new sites; use after redesign answers for site-wide redesign.",
        inputSchema: z.object({
          brief: z.string().describe("Planning brief from the user request"),
        }),
        execute: async ({ brief }, { abortSignal }) => {
          const redesignAnswers = await opts.loadRedesignAnswers();
          const prompt = redesignAnswers
            ? `${brief}\n\n## Redesign answers\n${formatRedesignAnswers(redesignAnswers)}`
            : brief;

          const result = await planAgent.generate({ prompt, abortSignal });
          const planned = result.output;
          if (!planned?.planMarkdown?.trim() || !planned.designBrief?.trim()) {
            throw new Error("Plan agent returned incomplete structured plan.");
          }

          await opts.persistPlan(planned.planMarkdown, planned.designBrief);
          await opts.onStep({
            kind: "plan",
            label: `Planned "${planned.siteName}"`,
            detail: `${planned.pageCount} page(s)`,
          });
          return {
            ok: true as const,
            siteName: planned.siteName,
            pageCount: planned.pageCount,
            next: `Planned "${planned.siteName}" (${planned.pageCount} pages). Call implement next.`,
          };
        },
      }),

      implement: tool({
        description:
          "Build or edit the Astro site. New builds require a stored plan.",
        inputSchema: z.object({
          task: z.string().describe("What to implement or change"),
        }),
        execute: async ({ task }, { abortSignal }) => {
          const stored = await opts.loadPlanMarkdown();
          const diskGenerated = await sandboxLooksGenerated(
            opts.sandbox.currentSandboxName()
          );
          const isNew = !opts.hasPreview && !diskGenerated;
          if (isNew && !stored) {
            return {
              ok: false as const,
              error: "No stored plan. Call plan first, then implement.",
            };
          }

          const result = await implementAgent.generate({
            prompt: stored
              ? `${task}\n\n## Authoritative build plan\n${stored}`
              : task,
            abortSignal,
          });
          const summary = (result.text || "Implement finished.").trim();
          await opts.onStep({ kind: "note", label: "Implement finished" });
          return {
            ok: true as const,
            summary: summary.slice(0, 2000),
            previewUrl:
              opts.sandbox.currentPreviewUrl() ?? opts.previewUrl ?? null,
          };
        },
      }),
    },
    providerOptions: anthropicThinkingOptions("low"),
    stopWhen: isStepCount(12),
  });
}
