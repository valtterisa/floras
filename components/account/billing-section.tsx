"use client";

import { useState } from "react";
import { useConvexAuth } from "convex/react";
import { useCustomer } from "autumn-js/react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  AI_CREDITS_FEATURE,
  formatCredits,
  isByokPlanId,
  isProPlanId,
  isSubscribedPlanId,
} from "@/lib/billing/constants";
import { Button } from "@/components/ui/button";
import { AccountSection } from "@/components/account/account-section";
import { TopUpModal } from "@/components/billing/top-up-modal";
import { PricingTableClient } from "@/components/pricing/pricing-table-client";

export function BillingSection() {
  const t = useTranslations("account.billing");
  const { isAuthenticated } = useConvexAuth();
  const { data, check, openCustomerPortal, refetch } = useCustomer({
    errorOnNotFound: false,
    queryOptions: { enabled: isAuthenticated },
  });
  const [topUpOpen, setTopUpOpen] = useState(false);

  let planName = t("noPlan");
  let planId: string | null = null;
  let remaining: number | null = null;
  let granted: number | null = null;

  if (data) {
    const subscribed = data.subscriptions.find(
      (s) =>
        s.status === "active" && isSubscribedPlanId(s.planId) && !s.autoEnable
    );
    const active = data.subscriptions.find((s) => s.status === "active");
    planId = subscribed?.planId ?? active?.planId ?? null;
    const rawName =
      subscribed?.plan?.name ??
      subscribed?.planId ??
      active?.plan?.name ??
      active?.planId ??
      t("noPlan");
    planName =
      rawName.length > 0
        ? rawName.charAt(0).toUpperCase() + rawName.slice(1)
        : t("noPlan");

    try {
      const result = check({
        featureId: AI_CREDITS_FEATURE,
        requiredBalance: 1,
      });
      remaining = result.balance?.remaining ?? null;
      granted = result.balance?.granted ?? null;
    } catch {
      const balance = data.balances[AI_CREDITS_FEATURE];
      remaining = balance?.remaining ?? null;
      granted = balance?.granted ?? null;
    }
  }

  const isPro = isProPlanId(planId);
  const isByok = isByokPlanId(planId);

  const onManage = async () => {
    try {
      await openCustomerPortal({
        returnUrl: `${window.location.origin}/dashboard/account`,
      });
    } catch {
      toast.error(t("portalFailed"));
    }
  };

  return (
    <AccountSection
      id="billing"
      title={t("title")}
      description={t("description")}
    >
      {!isAuthenticated ? (
        <p className="text-sm text-muted-foreground">{t("signIn")}</p>
      ) : !data ? (
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {t("currentPlan")}
                </p>
                <p className="mt-1 text-xl font-semibold tracking-tight">
                  {planName}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {t("creditsLeft")}
                </p>
                <p className="mt-1 text-xl font-semibold tracking-tight">
                  {isByok
                    ? t("yourKey")
                    : !isPro
                      ? "$0"
                      : remaining === null
                        ? "—"
                        : formatCredits(remaining)}
                </p>
                {isPro && granted != null ? (
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {t("ofIncluded", { amount: formatCredits(granted) })}
                  </p>
                ) : isByok ? (
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {t("billedByAnthropic")}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {isPro ? (
                <Button
                  variant="outline"
                  className="rounded-none"
                  onClick={() => setTopUpOpen(true)}
                >
                  {t("topUpCredits")}
                </Button>
              ) : null}
              <Button
                variant="outline"
                className="rounded-none"
                onClick={() => void onManage()}
              >
                {t("manageBilling")}
              </Button>
            </div>
          </div>

          <div className="overflow-hidden border border-border">
            <PricingTableClient />
          </div>
        </div>
      )}
      <TopUpModal
        open={topUpOpen}
        onOpenChange={setTopUpOpen}
        onPurchased={() => void refetch()}
      />
    </AccountSection>
  );
}
