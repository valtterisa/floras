import { z } from "zod";

export const redesignAnswersSchema = z.object({
  direction: z.enum(["minimal", "bold", "premium", "playful"]),
  directionNote: z.string().optional(),
  theme: z.enum(["light", "dark", "either"]),
  keep: z.string().optional(),
  scope: z.enum(["visuals", "restructure", "fresh"]),
});

export type RedesignAnswers = z.infer<typeof redesignAnswersSchema>;

export function formatRedesignAnswers(a: RedesignAnswers): string {
  const lines = [
    `direction: ${a.direction}`,
    a.directionNote ? `note: ${a.directionNote}` : null,
    `theme: ${a.theme}`,
    a.keep ? `keep: ${a.keep}` : null,
    `scope: ${a.scope}`,
  ];
  return lines.filter((line): line is string => Boolean(line)).join("\n");
}
