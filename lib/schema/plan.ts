import { z } from "zod";

export const planAgentOutputSchema = z.object({
  siteName: z.string().describe("Site / brand name"),
  pageCount: z.number().int().positive().describe("Number of pages planned"),
  planMarkdown: z
    .string()
    .describe(
      "Full markdown build plan with # Site, ## Design, ## Pages, ## File checklist"
    ),
  designBrief: z
    .string()
    .describe(
      "Short durable design brief for later edits: theme, accent, fonts, radii, dials, vibe, skill, do/don't. Plain prose, not a markdown dump."
    ),
});

export type PlanAgentOutput = z.infer<typeof planAgentOutputSchema>;
