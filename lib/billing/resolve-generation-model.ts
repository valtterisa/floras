import { createAnthropic } from "@ai-sdk/anthropic";
import { anthropic } from "@ai-sdk/anthropic";
import type { LanguageModel } from "ai";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { resolveAgentModelId } from "@/lib/ai/models";
import { getAccess } from "@/lib/billing/get-access";
import { decryptApiKey } from "@/lib/billing/byok-crypto";
import { withAutumnModel } from "@/lib/billing/with-autumn-model";

export type GenerationModelMode = "platform" | "byok";

export async function resolveUserAnthropicKey(
  token: string
): Promise<"missing" | { ok: true; apiKey: string } | { ok: false; reason: "decrypt" }> {
  const ciphertext = await fetchQuery(
    api.users.getAnthropicKeyCiphertext,
    {},
    { token }
  );
  if (!ciphertext) return "missing";
  try {
    return { ok: true, apiKey: decryptApiKey(ciphertext) };
  } catch {
    return { ok: false, reason: "decrypt" };
  }
}

export async function resolveGenerationModel(opts: {
  customerId: string;
  token: string;
  modelId?: string | null;
}): Promise<{ model: LanguageModel; mode: GenerationModelMode }> {
  const access = await getAccess(opts.customerId);
  const modelId = resolveAgentModelId(opts.modelId);

  if (access.hasByokPlan && !access.hasProPlan) {
    const key = await resolveUserAnthropicKey(opts.token);
    if (key === "missing") {
      throw new Error("Anthropic API key required for BYOK plan");
    }
    if (!key.ok) {
      throw new Error(
        "Could not decrypt your Anthropic API key. Re-add it in Account settings."
      );
    }
    const provider = createAnthropic({ apiKey: key.apiKey });
    return { model: provider(modelId), mode: "byok" };
  }

  const model = withAutumnModel(anthropic(modelId), opts.customerId);
  return { model, mode: "platform" };
}
