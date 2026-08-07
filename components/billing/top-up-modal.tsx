"use client";

import { useState } from "react";
import { useConvexAuth } from "convex/react";
import { useCustomer } from "autumn-js/react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  AI_CREDITS_FEATURE,
  TOP_UP_PACKS,
  TOP_UP_PLAN_ID,
  formatCredits,
  type TopUpPack,
} from "@/lib/billing/constants";

export type TopUpModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchased?: () => void;
};

export function TopUpModal({ open, onOpenChange, onPurchased }: TopUpModalProps) {
  const t = useTranslations("billing.topUp");
  const { isAuthenticated } = useConvexAuth();
  const { attach, data, refetch } = useCustomer({
    errorOnNotFound: false,
    queryOptions: { enabled: isAuthenticated && open },
  });
  const [selected, setSelected] = useState<TopUpPack>(TOP_UP_PACKS[1]!);
  const [pending, setPending] = useState(false);

  const balance = data?.balances?.[AI_CREDITS_FEATURE]?.remaining ?? null;
  const factItems = [t("facts.0"), t("facts.1"), t("facts.2")];

  const purchase = async () => {
    if (!isAuthenticated) {
      toast.error(t("signIn"));
      return;
    }
    setPending(true);
    try {
      const result = await attach({
        planId: TOP_UP_PLAN_ID,
        featureQuantities: [
          {
            featureId: AI_CREDITS_FEATURE,
            quantity: selected.credits,
          },
        ],
        redirectMode: "if_required",
      });

      if (result?.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }

      await refetch();
      onPurchased?.();
      onOpenChange(false);
      toast.success(t("added", { credits: selected.credits }));
    } catch {
      toast.error(t("failed"));
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-none border-border p-0 sm:max-w-md">
        <div className="border-b border-border px-6 py-5 pr-14">
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="mt-2 max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
            {t("description")}
          </DialogDescription>
        </div>

        <div
          role="group"
          aria-label={t("packAria")}
          className="grid grid-cols-3 border-b border-border"
        >
          {TOP_UP_PACKS.map((pack, index) => {
            const active = pack.id === selected.id;
            return (
              <button
                key={pack.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(pack)}
                className={cn(
                  "cursor-pointer px-4 py-4 text-left transition-colors",
                  index > 0 && "border-l border-border",
                  active ? "bg-brand-soft" : "hover:bg-background"
                )}
              >
                <span className="flex items-center justify-between gap-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {pack.hint ?? t("pack")}
                  </span>
                </span>
                <span className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
                    ${pack.credits}
                  </span>
                </span>
                <span className="mt-1 block font-mono text-[11px] tabular-nums text-muted-foreground">
                  {pack.priceLabel}
                </span>
              </button>
            );
          })}
        </div>

        <ul>
          {typeof balance === "number" ? (
            <li className="border-b border-border px-6 py-3 text-sm text-muted-foreground">
              {t("currentBalance")}{" "}
              <span className="font-mono tabular-nums text-foreground">
                {formatCredits(balance)}
              </span>
            </li>
          ) : null}
          {factItems.map((item) => (
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
              ? t("openingCheckout")
              : t("cta", { price: selected.priceLabel })}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
