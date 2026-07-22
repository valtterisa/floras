import {
  DEFAULT_AGENT_MODEL_ID,
  resolveAgentModelId,
  type AgentModelId,
} from "@/lib/ai/models";

/** @deprecated Prefer resolveAgentModelId / AGENT_MODELS */
export function getAgentModelId(): AgentModelId {
  return resolveAgentModelId(process.env.AGENT_MODEL);
}

export { DEFAULT_AGENT_MODEL_ID, resolveAgentModelId };
export type { AgentModelId };
