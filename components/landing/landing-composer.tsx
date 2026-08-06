"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useConvexAuth } from "convex/react";
import { toast } from "sonner";
import { PromptComposer } from "@/components/site/prompt-composer";
import { AuthModal } from "@/components/auth/auth-modal";
import {
  BillingGateModals,
  useBillingGates,
} from "@/components/billing/billing-gates";
import { useCreateSite } from "@/lib/hooks/use-create-site";
import { triggerGeneration } from "@/lib/generate/trigger-api";
import {
  DEFAULT_AGENT_MODEL_ID,
  type AgentModelId,
} from "@/lib/ai/models";
import { errorCode, userFacingError } from "@/lib/errors";

export function LandingComposer({
  initialPrompt,
}: {
  initialPrompt?: string;
}) {
  const t = useTranslations("composer");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useConvexAuth();
  const createSite = useCreateSite();
  const gates = useBillingGates();
  const [pending, setPending] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [modelId, setModelId] = useState<AgentModelId>(DEFAULT_AGENT_MODEL_ID);
  const [seedPrompt, setSeedPrompt] = useState(initialPrompt ?? "");

  useEffect(() => {
    const fromQuery = searchParams.get("prompt");
    if (fromQuery?.trim()) {
      setSeedPrompt(fromQuery.trim());
    }
  }, [searchParams]);

  const suggestions = [0, 1, 2, 3].map((i) => t(`suggestions.${i}`));

  const startGeneration = async (value: string, selectedModel: AgentModelId) => {
    if (!gates.allowOrPrompt()) return false;
    setPending(true);
    try {
      const id = await createSite({ prompt: value, modelId: selectedModel });
      await triggerGeneration(id);
      await gates.refetch();
      router.push(`/build/${id}`);
      return true;
    } catch (e) {
      if (!gates.handleDenyCode(errorCode(e))) {
        toast.error(userFacingError(e, "Could not start generation"));
      }
      setPending(false);
      return false;
    }
  };

  return (
    <>
      <PromptComposer
        key={seedPrompt}
        showModeToggle={false}
        autoFocus
        pending={pending}
        suggestions={suggestions}
        defaultModelId={modelId}
        defaultValue={seedPrompt}
        placeholder="Describe the site you want to build…"
        onSubmit={async (text, selectedModel) => {
          setModelId(selectedModel);
          if (!isAuthenticated) {
            setPendingPrompt(text);
            setAuthOpen(true);
            return false;
          }
          return startGeneration(text, selectedModel);
        }}
      />

      <AuthModal
        open={authOpen}
        onOpenChange={(open) => {
          setAuthOpen(open);
          if (!open) setPendingPrompt(null);
        }}
        prompt={pendingPrompt}
        modelId={modelId}
      />
      <BillingGateModals
        upgradeOpen={gates.upgradeOpen}
        topUpOpen={gates.topUpOpen}
        onUpgradeOpenChange={gates.setUpgradeOpen}
        onTopUpOpenChange={gates.setTopUpOpen}
        onPurchased={() => void gates.refetch()}
      />
    </>
  );
}
