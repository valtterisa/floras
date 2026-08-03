"use client";

import { useState } from "react";
import { useConvexAuth } from "convex/react";
import { useCustomer } from "autumn-js/react";
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
  const { isAuthenticated } = useConvexAuth();
  const { data, check, openCustomerPortal, refetch } = useCustomer({
    errorOnNotFound: false,
    queryOptions: { enabled: isAuthenticated },
  });
  const [topUpOpen, setTopUpOpen] = useState(false);

  let planName = "No plan";
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
      "No plan";
    planName =
      rawName.length > 0
        ? rawName.charAt(0).toUpperCase() + rawName.slice(1)
        : "No plan";

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
      toast.error("Could not open billing portal.");
    }
  };

  return (
    <AccountSection
      id="billing"
      title="Billing"
      description="Plan, usage, and payment settings for creating sites."
    >
      {!isAuthenticated ? (
        <p className="text-sm text-muted-foreground">
          Sign in to view billing.
        </p>
      ) : !data ? (
        <p className="text-sm text-muted-foreground">
          Loading billing… If this stays empty, Autumn may not be configured.
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Current plan
                </p>
                <p className="mt-1 text-xl font-semibold tracking-tight">
                  {planName}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Credits left
                </p>
                <p className="mt-1 text-xl font-semibold tracking-tight">
                  {isByok
                    ? "Your key"
                    : !isPro
                      ? "$0"
                      : remaining === null
                        ? "—"
                        : formatCredits(remaining)}
                </p>
                {isPro && granted != null ? (
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    of {formatCredits(granted)} included
                  </p>
                ) : isByok ? (
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Billed by Anthropic
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
                  Top up credits
                </Button>
              ) : null}
              <Button
                variant="outline"
                className="rounded-none"
                onClick={() => void onManage()}
              >
                Manage billing
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
