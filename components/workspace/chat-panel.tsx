"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useTranslations } from "next-intl";
import { api } from "@/convex/_generated/api";
import { asMessageId, asProjectId } from "@/lib/convex/ids";
import { toast } from "sonner";
import { MessageList, type ChatMessage } from "@/components/workspace/message-list";
import {
  PromptComposer,
  type ComposerMode,
} from "@/components/site/prompt-composer";
import {
  BillingGateModals,
  useBillingGates,
} from "@/components/billing/billing-gates";
import { Button } from "@/components/ui/button";
import { formatCredits, LOW_CREDIT_WARNING, MIN_CREDIT_BALANCE } from "@/lib/billing/constants";
import {
  DEFAULT_AGENT_MODEL_ID,
  resolveAgentModelId,
  type AgentModelId,
} from "@/lib/ai/models";
import { triggerAsk, triggerGeneration } from "@/lib/generate/trigger-api";
import { errorCode, userFacingError } from "@/lib/errors";
import { onPreviewFixRequest } from "@/lib/workspace/detect-preview-errors";

function ChatBillingBanner({
  billingReady,
  hasSubscription,
  hasByokPlan,
  hasProPlan,
  hasApiKey,
  balance,
  onUpgrade,
  onTopUp,
  onAddKey,
}: {
  billingReady: boolean;
  hasSubscription: boolean;
  hasByokPlan: boolean;
  hasProPlan: boolean;
  hasApiKey: boolean;
  balance: number | null;
  onUpgrade: () => void;
  onTopUp: () => void;
  onAddKey: () => void;
}) {
  const t = useTranslations("workspace");

  if (billingReady && !hasSubscription) {
    return (
      <div className="mb-2 flex items-center justify-between gap-2 border border-border bg-card/40 px-3 py-2 text-xs text-muted-foreground">
        <span>{t("needPlan")}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 rounded-none font-mono text-[10px] uppercase tracking-[0.14em]"
          onClick={onUpgrade}
        >
          {t("choosePlanCta")}
        </Button>
      </div>
    );
  }
  if (billingReady && hasByokPlan && !hasProPlan && !hasApiKey) {
    return (
      <div className="mb-2 flex items-center justify-between gap-2 border border-border bg-card/40 px-3 py-2 text-xs text-muted-foreground">
        <span>{t("needApiKey")}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 rounded-none font-mono text-[10px] uppercase tracking-[0.14em]"
          onClick={onAddKey}
        >
          {t("addKeyCta")}
        </Button>
      </div>
    );
  }
  if (hasProPlan && typeof balance === "number" && balance <= LOW_CREDIT_WARNING) {
    return (
      <div className="mb-2 flex items-center justify-between gap-2 border border-border bg-card/40 px-3 py-2 text-xs text-muted-foreground">
        <span>
          {balance < MIN_CREDIT_BALANCE
            ? t("outOfCredit")
            : t("creditLeft", { credit: formatCredits(balance) })}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 rounded-none font-mono text-[10px] uppercase tracking-[0.14em]"
          onClick={onTopUp}
        >
          {t("topUp")}
        </Button>
      </div>
    );
  }
  return null;
}

export function ChatPanel({
  projectId,
  project,
  busy,
  defaultMode = "build",
}: {
  projectId: string;
  project?: {
    modelId?: string;
    previewUrl?: string;
    busyAt?: number;
  } | null;
  busy: boolean;
  defaultMode?: ComposerMode;
}) {
  const t = useTranslations("workspace");
  const tComposer = useTranslations("composer");
  const pid = asProjectId(projectId);
  const messages = useQuery(api.messages.list, { projectId: pid }) as
    | ChatMessage[]
    | undefined;
  const send = useMutation(api.messages.send);
  const setModel = useMutation(api.projects.setModel);
  const abandonTurn = useMutation(api.messages.abandonStreamingTurn);
  const resetBusy = useMutation(api.projects.resetBusy);
  const gates = useBillingGates();
  const [mode, setMode] = useState<ComposerMode>(defaultMode);
  const [submitting, setSubmitting] = useState(false);
  const [resetting, setResetting] = useState(false);

  const defaultModelId = resolveAgentModelId(project?.modelId ?? null);
  const streaming = (messages ?? []).some((m) => m.status === "streaming");
  const pending = busy || streaming || submitting;
  const stuckMs =
    typeof project?.busyAt === "number" ? Date.now() - project.busyAt : 0;
  const showReset = busy && stuckMs > 2 * 60 * 1000;

  useEffect(() => {
    if (streaming) setSubmitting(false);
  }, [streaming]);

  const handle = async (
    text: string,
    modelId: AgentModelId,
    nextMode: ComposerMode
  ): Promise<boolean> => {
    if (!gates.allowOrPrompt()) return false;

    setSubmitting(true);
    let assistantId: string | undefined;
    try {
      await setModel({ projectId: pid, modelId });
      const sent = (await send({ projectId: pid, content: text, modelId })) as {
        assistantId: string;
      };
      assistantId = sent.assistantId;
      if (nextMode === "ask") {
        await triggerAsk(projectId);
      } else {
        await triggerGeneration(projectId);
      }
      void gates.refetch();
      return true;
    } catch (e) {
      if (assistantId) {
        try {
          await abandonTurn({ messageId: asMessageId(assistantId) });
        } catch {
        }
      }
      setSubmitting(false);
      if (gates.handleDenyCode(errorCode(e))) return false;
      toast.error(userFacingError(e, tComposer("couldNotSend")));
      return false;
    }
  };

  const handleRef = useRef(handle);
  handleRef.current = handle;
  const pendingRef = useRef(pending);
  pendingRef.current = pending;

  useEffect(() => {
    return onPreviewFixRequest((prompt) => {
      if (pendingRef.current) {
        toast.message(t("fixQueuedBusy"));
        return;
      }
      setMode("build");
      void handleRef
        .current(prompt, resolveAgentModelId(project?.modelId ?? null), "build")
        .then((ok) => {
          if (ok) toast.success(t("fixSent"));
        });
    });
  }, [project?.modelId, t]);

  return (
    <div className="flex h-full flex-col">
      <MessageList messages={messages ?? []} />
      <div className="border-t border-border p-3">
        {showReset ? (
          <div className="mb-2 flex items-center justify-between gap-2 border border-border bg-card/40 px-3 py-2 text-xs text-muted-foreground">
            <span>{t("stuck")}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={resetting}
              className="h-7 rounded-none font-mono text-[10px] uppercase tracking-[0.14em]"
              onClick={async () => {
                setResetting(true);
                try {
                  await resetBusy({ projectId: pid });
                  toast.success(t("resetSuccess"));
                } catch (e) {
                  toast.error(userFacingError(e, t("couldNotReset")));
                } finally {
                  setResetting(false);
                }
              }}
            >
              {resetting ? t("resetting") : t("reset")}
            </Button>
          </div>
        ) : null}
        <ChatBillingBanner
          billingReady={gates.billingReady}
          hasSubscription={gates.hasSubscription}
          hasByokPlan={gates.hasByokPlan}
          hasProPlan={gates.hasProPlan}
          hasApiKey={gates.hasApiKey}
          balance={gates.balance}
          onUpgrade={gates.openUpgrade}
          onTopUp={gates.openTopUp}
          onAddKey={() => {
            window.location.href = "/dashboard/account#api-key";
          }}
        />
        <PromptComposer
          key={defaultModelId}
          onSubmit={handle}
          pending={pending}
          mode={mode}
          onModeChange={setMode}
          defaultMode={defaultMode}
          defaultModelId={
            project === undefined ? DEFAULT_AGENT_MODEL_ID : defaultModelId
          }
        />
      </div>
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
