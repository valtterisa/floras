"use client";

import { useState } from "react";
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
  const { isAuthenticated } = useConvexAuth();
  const { attach, data, refetch } = useCustomer({
    errorOnNotFound: false,
    queryOptions: { enabled: isAuthenticated && open },
  });
  const [selected, setSelected] = useState<TopUpPack>(TOP_UP_PACKS[1]!);
  const [pending, setPending] = useState(false);

  const balance = data?.balances?.[AI_CREDITS_FEATURE]?.remaining ?? null;

  const purchase = async () => {
    if (!isAuthenticated) {
      toast.error("Sign in to top up credit.");
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
      toast.success(`Added $${selected.credits} credit.`);
    } catch {
      toast.error("Could not start top-up. Make sure billing is configured.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-none border-border p-0 sm:max-w-md">
        <div className="border-b border-border px-6 py-5 pr-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            AI credit
          </p>
          <DialogTitle className="mt-2 text-2xl font-semibold tracking-tight">
            Top up
          </DialogTitle>
          <DialogDescription className="mt-2 max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
            Extra credit never expires and stacks with your plan.
            {typeof balance === "number" ? (
              <>
                {" "}
                Balance{" "}
                <span className="font-mono tabular-nums text-foreground">
                  {formatCredits(balance)}
                </span>
                .
              </>
            ) : null}
          </DialogDescription>
        </div>

        <div role="listbox" aria-label="Credit packs" className="divide-y divide-border">
          {TOP_UP_PACKS.map((pack) => {
            const active = pack.id === selected.id;
            return (
              <button
                key={pack.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => setSelected(pack)}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-4 text-left transition-colors active:scale-[0.99]",
                  active ? "bg-brand-soft" : "hover:bg-background"
                )}
              >
                <span className="min-w-0">
                  <span className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold tracking-tight tabular-nums text-foreground">
                      ${pack.credits}
                    </span>
                    {pack.hint ? (
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        {pack.hint}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    Credit pack
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 font-mono text-sm tabular-nums",
                    active ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {pack.priceLabel}
                </span>
              </button>
            );
          })}
        </div>

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
              : `Top up · ${selected.priceLabel}`}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
