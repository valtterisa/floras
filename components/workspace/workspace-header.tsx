"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { TopUpModal } from "@/components/billing/top-up-modal";
import { UpgradeProModal } from "@/components/billing/upgrade-pro-modal";
import { formatCredits } from "@/lib/billing/constants";
import { useGenerationAccess } from "@/lib/hooks/use-generation-access";
import { cn } from "@/lib/utils";
import {
  visitUrl,
  type DomainStatus,
  type PublishStatus,
} from "@/lib/publish/types";

export function WorkspaceHeader({
  projectId,
  name,
  previewUrl,
  boxId,
  publishStatus,
  publishedUrl,
  publishError,
  customDomain,
  customDomainStatus,
}: {
  projectId: string;
  name?: string;
  previewUrl?: string;
  boxId?: string;
  publishStatus?: PublishStatus | null;
  publishedUrl?: string | null;
  publishError?: string | null;
  customDomain?: string | null;
  customDomainStatus?: DomainStatus | null;
}) {
  const { balance, hasPaidPlan, billingReady, refetch } = useGenerationAccess();
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (
      publishStatus === "published" ||
      publishStatus === "error" ||
      publishStatus === "idle"
    ) {
      setPublishing(false);
    }
  }, [publishStatus]);

  const creditLabel = formatCredits(balance);
  const isPublishing = publishing || publishStatus === "publishing";
  const isPublished = publishStatus === "published";
  const siteUrl = visitUrl({
    customDomain,
    customDomainStatus,
    publishedUrl,
  });
  const canPublish = Boolean(boxId) && !isPublishing;
  const openUrl = siteUrl ?? previewUrl;
  const openLabel = siteUrl ? "Live" : "Preview";

  async function handlePublish() {
    if (!canPublish) return;
    setPublishing(true);
    setLocalError(null);
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      const json: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const message =
          typeof json === "object" &&
          json !== null &&
          "error" in json &&
          typeof (json as { error: unknown }).error === "string"
            ? (json as { error: string }).error
            : "Publish failed";
        setLocalError(message);
        setPublishing(false);
      }
    } catch {
      setLocalError("Couldn't reach the server.");
      setPublishing(false);
    }
  }

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/60 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Button asChild variant="ghost" size="icon-sm" className="shrink-0">
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
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
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

          {openUrl ? (
            <a
              href={openUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center gap-1.5 border border-border bg-background px-2.5 text-foreground transition-colors hover:bg-card"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {openLabel}
              </span>
              <ExternalLink className="size-3 text-muted-foreground" />
            </a>
          ) : null}

          <button
            type="button"
            disabled={!canPublish}
            onClick={() => void handlePublish()}
            className={cn(
              "inline-flex h-8 items-center justify-center gap-1.5 bg-brand px-3 font-mono text-[10px] uppercase tracking-[0.14em] text-brand-foreground transition-[filter,transform] hover:brightness-110 active:scale-[0.98]",
              "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100"
            )}
          >
            {isPublishing ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span className="hidden sm:inline">Publishing</span>
              </>
            ) : isPublished ? (
              "Republish"
            ) : (
              "Publish"
            )}
          </button>
        </div>
      </header>

      {localError || publishError ? (
        <div className="border-b border-border px-4 py-2.5 text-sm text-muted-foreground">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-destructive">
            Publish
          </span>{" "}
          <span className="text-destructive">{localError ?? publishError}</span>
        </div>
      ) : null}

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
