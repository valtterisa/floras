"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  PromptComposer,
  type ComposerMode,
} from "@/components/site/prompt-composer";
import {
  BillingGateModals,
  useBillingGates,
} from "@/components/billing/billing-gates";
import { useCreateSite } from "@/lib/hooks/use-create-site";
import { triggerAsk, triggerGeneration } from "@/lib/generate/trigger-api";
import type { AgentModelId } from "@/lib/ai/models";
import { errorCode, userFacingError } from "@/lib/errors";

export function DashboardPrompt({ resetKey = 0 }: { resetKey?: number }) {
  const t = useTranslations("composer");
  const router = useRouter();
  const searchParams = useSearchParams();
  const createSite = useCreateSite();
  const gates = useBillingGates();
  const fromAuthPrompt = useRef(false);
  const [pending, setPending] = useState(false);
  const [mode, setMode] = useState<ComposerMode>("build");
  const [composerKey, setComposerKey] = useState(0);

  const suggestions = [0, 1, 2, 3, 4, 5].map((i) => t(`suggestions.${i}`));
  const askSuggestions = [0, 1, 2, 3, 4, 5].map((i) =>
    t(`askSuggestions.${i}`)
  );

  useEffect(() => {
    setMode("build");
    setComposerKey((k) => k + 1);
  }, [resetKey]);

  useEffect(() => {
    const fromAuth = searchParams.get("prompt");
    if (!fromAuth) return;
    fromAuthPrompt.current = true;
    router.replace("/dashboard", { scroll: false });
  }, [searchParams, router]);

  useEffect(() => {
    if (!fromAuthPrompt.current || !gates.billingReady) return;
    fromAuthPrompt.current = false;
    if (!gates.hasSubscription) gates.openUpgrade();
  }, [gates.billingReady, gates.hasSubscription, gates.openUpgrade]);

  const handle = async (
    text: string,
    modelId: AgentModelId,
    nextMode: ComposerMode
  ): Promise<boolean> => {
    if (!gates.allowOrPrompt()) return false;

    setPending(true);
    try {
      const id = (await createSite({
        prompt: text,
        modelId,
      })) as string;
      if (nextMode === "ask") {
        await triggerAsk(id);
      } else {
        await triggerGeneration(id);
      }
      void gates.refetch();
      router.push(`/build/${id}${nextMode === "ask" ? "?mode=ask" : ""}`);
      return true;
    } catch (e) {
      if (gates.handleDenyCode(errorCode(e))) return false;
      toast.error(userFacingError(e, t("couldNotCreate")));
      return false;
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:px-12">
      <PromptComposer
        key={composerKey}
        onSubmit={handle}
        pending={pending}
        mode={mode}
        onModeChange={setMode}
        autoFocus
        suggestions={mode === "ask" ? askSuggestions : suggestions}
        placeholder={
          mode === "ask"
            ? t("placeholderAsk")
            : t("placeholderDashboardBuild")
        }
      />
      <BillingGateModals
        upgradeOpen={gates.upgradeOpen}
        topUpOpen={gates.topUpOpen}
        onUpgradeOpenChange={gates.setUpgradeOpen}
        onTopUpOpenChange={gates.setTopUpOpen}
        onPurchased={() => void gates.refetch()}
      />
    </div>
  );
}
