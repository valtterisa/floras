import { parseAsBoolean, parseAsStringLiteral, useQueryState } from "nuqs";

export function useSettings() {
  const [modelId] = useModelId();
  const [fixErrors] = useFixErrors();
  const [reasoningEffort] = useReasoningEffort();
  return { modelId, fixErrors, reasoningEffort };
}

export function useModelId() {
  return useQueryState(
    "modelId",
    parseAsStringLiteral(["gpt-4o", "gpt-4o-mini"]).withDefault("gpt-4o")
  );
}

export function useReasoningEffort() {
  return useQueryState(
    "effort",
    parseAsStringLiteral(["medium", "low"]).withDefault("low")
  );
}

export function useFixErrors() {
  return useQueryState("fix-errors", parseAsBoolean.withDefault(true));
}
