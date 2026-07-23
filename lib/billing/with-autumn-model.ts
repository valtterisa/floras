import type { LanguageModel } from "ai";
import { withAutumn } from "@useautumn/gateway/ai-sdk";
import { AI_CREDITS_FEATURE } from "@/lib/billing/constants";

export function withAutumnModel(
  model: LanguageModel,
  customerId: string
): LanguageModel {
  return withAutumn({
    model: model as never,
    customerId,
    providerId: "anthropic",
    featureId: AI_CREDITS_FEATURE,
  }) as LanguageModel;
}
