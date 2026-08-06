"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Copy01Icon,
  Download01Icon,
  LinkSquare02Icon,
  Loading03Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { FLORAS_SITES_DOMAIN, type DomainStatus } from "@/lib/publish/types";
import { cn } from "@/lib/utils";

export type PublishModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onUnpublish?: () => void;
  onExport?: () => void;
  onUpgrade?: () => void;
  publishing: boolean;
  unpublishing?: boolean;
  exporting?: boolean;
  isPublished: boolean;
  canPublish?: boolean;
  publishedUrl?: string | null;
  cfSubdomain?: string | null;
  customDomain?: string | null;
  customDomainStatus?: DomainStatus | null;
};

function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, "");
}

export function PublishModal({
  open,
  onOpenChange,
  onConfirm,
  onUnpublish,
  onExport,
  onUpgrade,
  publishing,
  unpublishing = false,
  exporting = false,
  isPublished,
  canPublish = true,
  publishedUrl,
  cfSubdomain,
  customDomain,
  customDomainStatus,
}: PublishModalProps) {
  const t = useTranslations("publish");
  const [copied, setCopied] = useState(false);
  const busy = publishing || unpublishing || exporting;

  const florasUrl =
    publishedUrl ?? (cfSubdomain ? `https://${cfSubdomain}` : null);
  const customActive =
    Boolean(customDomain) && customDomainStatus === "active"
      ? `https://${customDomain}`
      : null;
  const liveUrl = customActive ?? florasUrl;
  const pendingCustom =
    customDomain &&
    customDomainStatus &&
    customDomainStatus !== "active" &&
    customDomainStatus !== "deactivated"
      ? customDomain
      : null;

  async function copyUrl() {
    if (!liveUrl) return;
    await navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  const facts = !canPublish
    ? ([0, 1, 2] as const).map((i) => t(`factsExport.${i}`))
    : isPublished
      ? ([0, 1, 2, 3] as const).map((i) => t(`factsPublished.${i}`))
      : ([0, 1, 2, 3] as const).map((i) =>
          i === 1
            ? t(`factsPublish.1`, { domain: FLORAS_SITES_DOMAIN })
            : t(`factsPublish.${i}`)
        );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-none border-border p-0 sm:max-w-md">
        <div className="border-b border-border px-6 py-5 pr-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {!canPublish
              ? t("eyebrowExport")
              : isPublished
                ? t("eyebrowLive")
                : t("eyebrowGoLive")}
          </p>
          <DialogTitle className="mt-2 text-2xl font-semibold tracking-tight">
            {!canPublish
              ? t("titleExport")
              : isPublished
                ? t("titleLive")
                : t("titlePublish")}
          </DialogTitle>
          <DialogDescription className="mt-2 max-w-[40ch] text-sm leading-relaxed text-muted-foreground">
            {!canPublish
              ? t("descByok")
              : isPublished
                ? t("descLive")
                : t("descConfirm")}
          </DialogDescription>
        </div>

        {canPublish ? (
        <div className="border-b border-border px-6 py-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {liveUrl ? t("liveUrl") : t("yourUrl")}
          </p>
          {liveUrl ? (
            <div className="mt-2 flex items-start gap-2">
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="min-w-0 flex-1 break-all font-mono text-sm text-foreground underline-offset-4 hover:underline"
              >
                {stripProtocol(liveUrl)}
              </a>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => void copyUrl()}
                  className="inline-flex size-8 cursor-pointer items-center justify-center border border-border text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                  aria-label={t("copyUrl")}
                >
                  {copied ? (
                    <HugeiconsIcon icon={Tick02Icon} className="size-3.5" />
                  ) : (
                    <HugeiconsIcon icon={Copy01Icon} className="size-3.5" />
                  )}
                </button>
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex size-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                  aria-label={t("openLive")}
                >
                  <HugeiconsIcon icon={LinkSquare02Icon} className="size-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <p className="mt-2 font-mono text-sm text-foreground">
              *.{FLORAS_SITES_DOMAIN}
            </p>
          )}
          {!liveUrl ? (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("uniqueAddress")}
            </p>
          ) : null}
          {pendingCustom ? (
            <p className="mt-3 text-sm text-muted-foreground">
              {t("pendingCustom")}{" "}
              <span className="font-mono text-foreground">{pendingCustom}</span>
            </p>
          ) : null}
          {customActive && florasUrl ? (
            <p className="mt-3 truncate font-mono text-[11px] text-muted-foreground">
              {t("alsoAt", { url: stripProtocol(florasUrl) })}
            </p>
          ) : null}
        </div>
        ) : null}

        <ul>
          {facts.map((item) => (
            <li
              key={item}
              className="border-b border-border px-6 py-3 text-sm text-muted-foreground last:border-b-0"
            >
              {item}
            </li>
          ))}
          {canPublish ? (
          <li className="border-b border-border px-6 py-3 text-sm text-muted-foreground last:border-b-0">
            {t("manageDomainsBefore")}{" "}
            <Link
              href="/dashboard/account#domains"
              className="text-foreground underline-offset-4 hover:underline"
              onClick={() => onOpenChange(false)}
            >
              {t("manageDomainsLink")}
            </Link>
          </li>
          ) : null}
        </ul>

        <div className="border-t border-border p-0">
          {canPublish && isPublished ? (
            <>
              {liveUrl ? (
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 bg-brand px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-brand-foreground transition-[filter] hover:brightness-110 active:scale-[0.99]"
                  >
                    <HugeiconsIcon icon={LinkSquare02Icon} className="size-3.5" />
                    {t("openSite")}
                  </a>
                  <button
                    type="button"
                    onClick={onConfirm}
                    disabled={busy}
                    className={cn(
                      "inline-flex h-12 cursor-pointer items-center justify-center gap-2 border-t border-border bg-background px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-card active:scale-[0.99] sm:border-t-0 sm:border-l",
                      "disabled:cursor-not-allowed disabled:opacity-40"
                    )}
                  >
                    {publishing ? (
                      <>
                        <HugeiconsIcon icon={Loading03Icon} className="size-3.5 animate-spin" />
                        {t("publishing")}
                      </>
                    ) : (
                      t("updateLive")
                    )}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={busy}
                  className={cn(
                    "inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 bg-brand px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-brand-foreground transition-[filter] active:scale-[0.99]",
                    "hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100"
                  )}
                >
                  {publishing ? (
                    <>
                      <HugeiconsIcon icon={Loading03Icon} className="size-3.5 animate-spin" />
                      {t("publishing")}
                    </>
                  ) : (
                    t("updateLive")
                  )}
                </button>
              )}
              {onUnpublish ? (
                <button
                  type="button"
                  onClick={onUnpublish}
                  disabled={busy}
                  className={cn(
                    "inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 border-t border-border bg-background px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-destructive transition-colors hover:bg-destructive/5 active:scale-[0.99]",
                    "disabled:cursor-not-allowed disabled:opacity-40"
                  )}
                >
                  {unpublishing ? (
                    <>
                      <HugeiconsIcon icon={Loading03Icon} className="size-3.5 animate-spin" />
                      {t("unpublishing")}
                    </>
                  ) : (
                    t("unpublish")
                  )}
                </button>
              ) : null}
            </>
          ) : canPublish ? (
            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className={cn(
                "inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 bg-brand px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-brand-foreground transition-[filter] active:scale-[0.99]",
                "hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100"
              )}
            >
              {publishing ? (
                <>
                  <HugeiconsIcon icon={Loading03Icon} className="size-3.5 animate-spin" />
                  {t("publishing")}
                </>
              ) : (
                t("publishSite")
              )}
            </button>
          ) : onUpgrade ? (
            <button
              type="button"
              onClick={onUpgrade}
              className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 bg-brand px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-brand-foreground transition-[filter] hover:brightness-110 active:scale-[0.99]"
            >
              {t("upgradeHosting")}
            </button>
          ) : null}
          {onExport ? (
            <button
              type="button"
              onClick={onExport}
              disabled={busy}
              className={cn(
                "inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 border-t border-border bg-background px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-card active:scale-[0.99]",
                "disabled:cursor-not-allowed disabled:opacity-40"
              )}
            >
              {exporting ? (
                <>
                  <HugeiconsIcon icon={Loading03Icon} className="size-3.5 animate-spin" />
                  {t("exporting")}
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={Download01Icon} className="size-3.5" />
                  {t("exportZip")}
                </>
              )}
            </button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
