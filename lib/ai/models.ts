export const AGENT_MODELS = [
  {
    id: "claude-sonnet-5",
    label: "Sonnet",
    hint: "Fast",
  },
  {
    id: "claude-opus-4-8",
    label: "Opus",
    hint: "Strong",
  },
  {
    id: "claude-fable-5",
    label: "Fable",
    hint: "Max",
  },
] as const;

export type AgentModelId = (typeof AGENT_MODELS)[number]["id"];

export const DEFAULT_AGENT_MODEL_ID: AgentModelId = "claude-sonnet-5";

export function isAgentModelId(value: string | undefined | null): value is AgentModelId {
  return AGENT_MODELS.some((model) => model.id === value);
}

export function resolveAgentModelId(
  value: string | undefined | null
): AgentModelId {
  if (isAgentModelId(value)) return value;
  const fromEnv = process.env.AGENT_MODEL?.trim();
  if (isAgentModelId(fromEnv)) return fromEnv;
  return DEFAULT_AGENT_MODEL_ID;
}
