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

const FACTS = [
  "Credit never expires",
  "Stacks on top of your plan balance",
  "Used for ask, build, and refinements",
];

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
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            Top up
          </DialogTitle>
          <DialogDescription className="mt-2 max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
            Add credit for ask, build, and chat refinements.
          </DialogDescription>
        </div>

        <div
          role="group"
          aria-label="Credit pack"
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
                    {pack.hint ?? "Pack"}
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
              Current balance{" "}
              <span className="font-mono tabular-nums text-foreground">
                {formatCredits(balance)}
              </span>
            </li>
          ) : null}
          {FACTS.map((item) => (
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
              : `Top up · ${selected.priceLabel}`}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
