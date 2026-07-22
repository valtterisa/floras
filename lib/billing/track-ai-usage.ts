import { Autumn } from "autumn-js";
import { AI_CREDITS_FEATURE } from "@/lib/billing/constants";
import { resolveAgentModelId } from "@/lib/ai/models";

type UsageLike = {
  inputTokens?: number | undefined;
  outputTokens?: number | undefined;
  inputTokenDetails?: {
    noCacheTokens?: number | undefined;
    cacheReadTokens?: number | undefined;
    cacheWriteTokens?: number | undefined;
  };
  outputTokenDetails?: {
    textTokens?: number | undefined;
    reasoningTokens?: number | undefined;
  };
};

export async function trackAiTokenUsage(opts: {
  customerId: string;
  usage: UsageLike | undefined | null;
  modelId?: string | null;
}): Promise<void> {
  const secretKey = process.env.AUTUMN_SECRET_KEY;
  if (!secretKey || !opts.usage) return;

  const inputFromDetails = opts.usage.inputTokenDetails?.noCacheTokens;
  const inputTokens =
    typeof inputFromDetails === "number"
      ? inputFromDetails
      : (opts.usage.inputTokens ?? 0);
  const outputFromDetails = opts.usage.outputTokenDetails?.textTokens;
  const outputTokens =
    typeof outputFromDetails === "number"
      ? outputFromDetails
      : (opts.usage.outputTokens ?? 0);

  if (inputTokens <= 0 && outputTokens <= 0) return;

  const modelId = resolveAgentModelId(opts.modelId);
  const autumn = new Autumn({ secretKey });
  await autumn.trackTokens({
    customerId: opts.customerId,
    featureId: AI_CREDITS_FEATURE,
    modelId: `anthropic/${modelId}`,
    inputTokens,
    outputTokens,
    cacheReadTokens: opts.usage.inputTokenDetails?.cacheReadTokens,
    cacheWriteTokens: opts.usage.inputTokenDetails?.cacheWriteTokens,
    reasoningTokens: opts.usage.outputTokenDetails?.reasoningTokens,
  });
}
