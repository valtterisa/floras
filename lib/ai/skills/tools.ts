import { tool } from "ai";
import { z } from "zod";
import type { AgentStep } from "@/lib/ai/agent-shared";
import { DESIGN_SKILLS } from "@/lib/ai/skills/registry";

export function createLoadDesignSkillTool(opts: {
  onStep: (step: AgentStep) => Promise<void> | void;
}) {
  return tool({
    description:
      "Load design_taste into context. Call once before drafting a new plan or polishing a new/redesign build.",
    inputSchema: z.object({}),
    execute: async () => {
      const skill = DESIGN_SKILLS.design_taste;
      await opts.onStep({
        kind: "note",
        label: `Loaded design skill: ${skill.id}`,
      });
      return {
        ok: true as const,
        id: skill.id,
        title: skill.title,
        body: skill.body,
      };
    },
  });
}

export function createRecallDesignBriefTool(opts: {
  onStep: (step: AgentStep) => Promise<void> | void;
  loadDesignBrief: () => Promise<string | null>;
}) {
  return tool({
    description:
      "Recall the short site design brief. Prefer this over load_design_skill on normal edits.",
    inputSchema: z.object({}),
    execute: async () => {
      const designBrief = await opts.loadDesignBrief();
      await opts.onStep({
        kind: "note",
        label: designBrief ? "Recalled design brief" : "No design brief stored",
      });
      return { designBrief };
    },
  });
}
