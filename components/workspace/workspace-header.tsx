"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { TopUpModal } from "@/components/billing/top-up-modal";
import { UpgradeProModal } from "@/components/billing/upgrade-pro-modal";
import { formatCredits } from "@/lib/billing/constants";
import { useGenerationAccess } from "@/lib/hooks/use-generation-access";

export function WorkspaceHeader({
  name,
  previewUrl,
}: {
  name?: string;
  previewUrl?: string;
}) {
  const { balance, hasPaidPlan, billingReady, refetch } = useGenerationAccess();
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const creditLabel = formatCredits(balance);

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/60 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="size-8 shrink-0">
            <Link href="/dashboard">
              <ArrowLeft className="size-4" />
              <span className="sr-only">Back to dashboard</span>
            </Link>
          </Button>
          <Logo />
          <span className="hidden truncate text-sm text-muted-foreground sm:inline">
            / {name ?? "…"}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {billingReady ? (
            <button
              type="button"
              onClick={() => {
                if (!hasPaidPlan) setUpgradeOpen(true);
                else setTopUpOpen(true);
              }}
              className="inline-flex h-8 cursor-pointer items-center gap-2 border border-border bg-background px-2.5 transition-colors hover:bg-card"
              aria-label={
                !hasPaidPlan
                  ? "Get Pro plan"
                  : `AI credit ${creditLabel}. Top up`
              }
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Credit
              </span>
              <span className="font-mono text-[11px] tabular-nums text-foreground">
                {!hasPaidPlan ? "—" : creditLabel}
              </span>
            </button>
          ) : null}
          {previewUrl ? (
            <Button asChild variant="outline" size="sm" className="h-8 rounded-none">
              <a href={previewUrl} target="_blank" rel="noreferrer">
                Open preview <ExternalLink className="ml-1.5 size-3.5" />
              </a>
            </Button>
          ) : null}
        </div>
      </header>
      <UpgradeProModal
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        onPurchased={() => void refetch()}
      />
      <TopUpModal
        open={topUpOpen}
        onOpenChange={setTopUpOpen}
        onPurchased={() => void refetch()}
      />
    </>
  );
}
