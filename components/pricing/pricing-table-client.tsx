"use client";

import { useState } from "react";
import { useConvexAuth } from "convex/react";
import { useCustomer } from "autumn-js/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  BYOK_PLAN_ID,
  ENTERPRISE_CONTACT_HREF,
  ENTERPRISE_PLAN_ID,
  PRO_MONTHLY_PLAN_ID,
  PRO_YEARLY_PLAN_ID,
  isSubscribedPlanId,
} from "@/lib/billing/constants";
import { checkoutSuccessUrl, redirectToCheckout } from "@/lib/billing/checkout";
import { useTranslations } from "next-intl";

type BillingInterval = "month" | "year";

type PlanCard = {
  id: string;
  name: string;
  price: string;
  cadence?: string;
  note?: string;
  features: readonly string[];
  highlight?: boolean;
  cta: string;
};

function usePlanCards(interval: BillingInterval): PlanCard[] {
  const t = useTranslations("plans");
  const byok = t.raw("byok") as string[];
  const pro = t.raw("proExtended") as string[];
  const enterprise = t.raw("enterprise") as string[];

  if (interval === "month") {
    return [
      {
        id: BYOK_PLAN_ID,
        name: "BYOK",
        price: "$5",
        cadence: "/mo",
        features: byok,
        cta: t("getByok"),
      },
      {
        id: PRO_MONTHLY_PLAN_ID,
        name: "Pro",
        price: "$20",
        cadence: "/mo",
        highlight: true,
        features: pro,
        cta: t("getPro"),
      },
      {
        id: ENTERPRISE_PLAN_ID,
        name: "Enterprise",
        price: t("customPrice"),
        features: enterprise,
        cta: t("talkToFounder"),
      },
    ];
  }

  return [
    {
      id: BYOK_PLAN_ID,
      name: "BYOK",
      price: "$5",
      cadence: "/mo",
      note: t("billedMonthly"),
      features: byok,
      cta: t("getByok"),
    },
    {
      id: PRO_YEARLY_PLAN_ID,
      name: "Pro",
      price: "$192",
      cadence: "/yr",
      note: t("saveYearly"),
      highlight: true,
      features: pro,
      cta: t("getProYearly"),
    },
    {
      id: ENTERPRISE_PLAN_ID,
      name: "Enterprise",
      price: t("customPrice"),
      features: enterprise,
      cta: t("talkToFounder"),
    },
  ];
}

export function PricingTableClient() {
  const t = useTranslations("plans");
  const { isAuthenticated } = useConvexAuth();
  const { attach, data, refetch } = useCustomer({
    errorOnNotFound: false,
    queryOptions: { enabled: isAuthenticated },
  });
  const [interval, setInterval] = useState<BillingInterval>("month");
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const plans = usePlanCards(interval);

  const activePaid = data?.subscriptions?.find(
    (s) =>
      s.status === "active" && isSubscribedPlanId(s.planId) && !s.autoEnable
  );
  const currentPlanId = activePaid?.planId ?? null;

  const onSelect = async (planId: string) => {
    if (planId === ENTERPRISE_PLAN_ID) {
      window.open(ENTERPRISE_CONTACT_HREF, "_blank", "noopener,noreferrer");
      return;
    }

    if (!isAuthenticated) {
      toast.error(t("signInToUpgrade"));
      window.location.href = `/login?next=${encodeURIComponent("/#pricing")}`;
      return;
    }

    if (planId === currentPlanId) {
      toast.message(t("alreadyOnPlan"));
      return;
    }

    setPendingPlan(planId);
    try {
      const result = await attach({
        planId,
        redirectMode: "always",
        successUrl: checkoutSuccessUrl(
          planId === BYOK_PLAN_ID
            ? "/dashboard/account#api-key"
            : "/dashboard/account"
        ),
      });

      if (await redirectToCheckout(result)) return;

      await refetch();
      toast.success(t("planUpdated"));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("couldNotCheckout");
      toast.error(message);
    } finally {
      setPendingPlan(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-3 border-b border-border px-6 py-5 md:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {t("billingPeriod")}
        </p>
        <div
          role="group"
          aria-label={t("billingPeriod")}
          className="inline-flex border border-border bg-background"
        >
          <button
            type="button"
            aria-pressed={interval === "month"}
            onClick={() => setInterval("month")}
            className={cn(
              "cursor-pointer px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
              interval === "month"
                ? "bg-brand text-brand-foreground"
                : "text-muted-foreground hover:bg-card hover:text-foreground"
            )}
          >
            {t("monthly")}
          </button>
          <button
            type="button"
            aria-pressed={interval === "year"}
            onClick={() => setInterval("year")}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 border-l border-border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
              interval === "year"
                ? "bg-brand text-brand-foreground"
                : "text-muted-foreground hover:bg-card hover:text-foreground"
            )}
          >
            {t("yearly")}
            <span
              className={cn(
                "border px-1.5 py-0.5 text-[9px] tracking-[0.12em]",
                interval === "year"
                  ? "border-brand-foreground/30 text-brand-foreground"
                  : "border-brand/40 text-brand"
              )}
            >
              {t("yearlyDiscount")}
            </span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3">
        {plans.map((plan, i) => {
          const isCurrent = plan.id === currentPlanId;
          const pending = pendingPlan === plan.id;
          const isEnterprise = plan.id === ENTERPRISE_PLAN_ID;
          return (
            <div
              key={`${interval}-${plan.id}`}
              className={cn(
                "flex flex-col border-border p-6 md:p-8",
                i < plans.length - 1 ? "border-b md:border-b-0 md:border-r" : "",
                plan.highlight ? "bg-brand-soft" : "bg-card/40"
              )}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-lg font-semibold tracking-tight">{plan.name}</h3>
                {plan.highlight ? (
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand">
                    {t("popular")}
                  </span>
                ) : null}
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">
                  {plan.price}
                </span>
                {plan.cadence ? (
                  <span className="text-sm text-muted-foreground">{plan.cadence}</span>
                ) : null}
              </div>
              {plan.note ? (
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {plan.note}
                </p>
              ) : null}
              <ul className="mt-8 flex flex-col border-y border-border">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="border-b border-border py-3 text-sm text-muted-foreground last:border-b-0"
                  >
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={pending || (isCurrent && !isEnterprise)}
                onClick={() => void onSelect(plan.id)}
                className={cn(
                  "mt-8 inline-flex h-11 cursor-pointer items-center justify-center px-5 font-mono text-[11px] uppercase tracking-[0.14em] transition-[filter] active:scale-[0.98]",
                  plan.highlight
                    ? "bg-brand text-brand-foreground hover:brightness-110"
                    : "border border-border bg-card text-foreground hover:bg-background",
                  "disabled:cursor-not-allowed disabled:opacity-40"
                )}
              >
                {pending
                  ? t("openingCheckout")
                  : isCurrent && !isEnterprise
                    ? t("currentPlan")
                    : plan.cta}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
