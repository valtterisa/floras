import {
  ToolLoopAgent,
  Output,
  isStepCount,
  type LanguageModel,
} from "ai";
import { anthropicThinkingOptions } from "@/lib/ai/anthropic-options";
import type { AgentStep } from "@/lib/ai/agent-shared";
import { createLoadDesignSkillTool } from "@/lib/ai/skills/tools";
import { planAgentOutputSchema } from "@/lib/schema/plan";

const PLAN_INSTRUCTIONS = `You are Floras site planner.

Before drafting: call load_design_skill once.
Then finish with structured output (not free-form chat).

planMarkdown required headings:
# Site
## Design
## Pages
## File checklist

## Design must cover theme, accent, fonts, radii, dials, vibe, skill: design_taste, and short do/don't.
## Pages: one ### per page with sections.
## File checklist: key paths to write.

designBrief: write a short plain-prose brief the implementer can reuse on later edits (theme, accent, fonts, radii, dials, vibe, do/don't). Do not rely on stripping markdown — author it as its own field.

Honor redesign answers if present. Contact/booking briefs need a Floras form contact section.
`;

export function buildPlanAgent(opts: {
  model: LanguageModel;
  onStep: (step: AgentStep) => Promise<void> | void;
}) {
  return new ToolLoopAgent({
    model: opts.model,
    instructions: PLAN_INSTRUCTIONS,
    tools: {
      load_design_skill: createLoadDesignSkillTool({ onStep: opts.onStep }),
    },
    output: Output.object({ schema: planAgentOutputSchema }),
    providerOptions: anthropicThinkingOptions("medium"),
    stopWhen: isStepCount(8),
  });
}
