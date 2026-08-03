"use client";

import { useEffect, useState } from "react";
import { useConvexAuth } from "convex/react";
import { useCustomer } from "autumn-js/react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  BYOK_PLAN_ID,
  PRO_MONTHLY_PLAN_ID,
  PRO_YEARLY_PLAN_ID,
} from "@/lib/billing/constants";
import { BYOK_FEATURES, PRO_FEATURES } from "@/lib/billing/plan-copy";
import { checkoutSuccessUrl, redirectToCheckout } from "@/lib/billing/checkout";

export type UpgradeProModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchased?: () => void;
  defaultTier?: "byok" | "pro";
};

export function UpgradeProModal({
  open,
  onOpenChange,
  onPurchased,
  defaultTier = "byok",
}: UpgradeProModalProps) {
  const { isAuthenticated } = useConvexAuth();
  const { attach, refetch } = useCustomer({
    errorOnNotFound: false,
    queryOptions: { enabled: isAuthenticated && open },
  });
  const [tier, setTier] = useState<"byok" | "pro">(defaultTier);
  const [interval, setInterval] = useState<"month" | "year">("month");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (open) setTier(defaultTier);
  }, [open, defaultTier]);

  const planId =
    tier === "byok"
      ? BYOK_PLAN_ID
      : interval === "month"
        ? PRO_MONTHLY_PLAN_ID
        : PRO_YEARLY_PLAN_ID;
  const priceLabel =
    tier === "byok" ? "$5" : interval === "month" ? "$20" : "$192";
  const cadenceLabel = tier === "byok" || interval === "month" ? "/mo" : "/yr";
  const features = tier === "byok" ? BYOK_FEATURES : PRO_FEATURES;
  const ctaLabel = tier === "byok" ? "Get BYOK" : "Get Pro";

  const purchase = async () => {
    if (!isAuthenticated) {
      toast.error("Sign in to continue.");
      return;
    }
    setPending(true);
    try {
      const result = await attach({
        planId,
        redirectMode: "always",
        successUrl: checkoutSuccessUrl(
          tier === "byok" ? "/dashboard/account#api-key" : "/dashboard"
        ),
      });
      if (await redirectToCheckout(result)) return;
      await refetch();
      onPurchased?.();
      onOpenChange(false);
      toast.success(tier === "byok" ? "BYOK is active." : "Pro is active.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not open checkout."
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-none border-border p-0 sm:max-w-md">
        <div className="border-b border-border px-6 py-5 pr-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Required to continue
          </p>
          <DialogTitle className="mt-2 text-2xl font-semibold tracking-tight">
            Choose a plan
          </DialogTitle>
          <DialogDescription className="mt-2 max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
            BYOK covers sandboxes with your Anthropic key. Pro includes Floras
            AI credits and hosting.
          </DialogDescription>
        </div>

        <div
          role="group"
          aria-label="Plan"
          className="grid grid-cols-2 border-b border-border"
        >
          <button
            type="button"
            aria-pressed={tier === "byok"}
            onClick={() => setTier("byok")}
            className={cn(
              "cursor-pointer px-5 py-4 text-left transition-colors",
              tier === "byok" ? "bg-brand-soft" : "hover:bg-background"
            )}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              BYOK
            </span>
            <span className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-semibold tracking-tight text-foreground">
                $5
              </span>
              <span className="text-sm text-muted-foreground">/mo</span>
            </span>
          </button>
          <button
            type="button"
            aria-pressed={tier === "pro"}
            onClick={() => setTier("pro")}
            className={cn(
              "cursor-pointer border-l border-border px-5 py-4 text-left transition-colors",
              tier === "pro" ? "bg-brand-soft" : "hover:bg-background"
            )}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Pro
            </span>
            <span className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-semibold tracking-tight text-foreground">
                {interval === "month" ? "$20" : "$192"}
              </span>
              <span className="text-sm text-muted-foreground">
                {interval === "month" ? "/mo" : "/yr"}
              </span>
            </span>
          </button>
        </div>

        {tier === "pro" ? (
          <div
            role="group"
            aria-label="Billing period"
            className="grid grid-cols-2 border-b border-border"
          >
            <button
              type="button"
              aria-pressed={interval === "month"}
              onClick={() => setInterval("month")}
              className={cn(
                "cursor-pointer px-5 py-3 text-left font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
                interval === "month"
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:bg-background"
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              aria-pressed={interval === "year"}
              onClick={() => setInterval("year")}
              className={cn(
                "cursor-pointer border-l border-border px-5 py-3 text-left font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
                interval === "year"
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:bg-background"
              )}
            >
              Yearly −20%
            </button>
          </div>
        ) : null}

        <ul>
          {features.map((item) => (
            <li
              key={item}
              className="border-b border-border px-6 py-3 text-sm text-muted-foreground last:border-b-0"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="border-t border-border p-0">
          <button
            type="button"
            onClick={() => void purchase()}
            disabled={pending || !isAuthenticated}
            className={cn(
              "inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 bg-brand px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-brand-foreground transition-[filter] active:scale-[0.99]",
              "hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100"
            )}
          >
            {pending
              ? "Opening checkout…"
              : `${ctaLabel} · ${priceLabel}${cadenceLabel}`}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
