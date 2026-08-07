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
import { Button, buttonVariants } from "@/components/ui/button";
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

  const title = !canPublish
    ? t("titleExport")
    : isPublished
      ? t("titleLive")
      : t("titlePublish");

  const description = !canPublish
    ? t("descByok")
    : isPublished
      ? t("descLive")
      : t("descConfirm");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90dvh,calc(100dvh-2rem))] w-[calc(100%-2rem)] max-w-md gap-0 overflow-y-auto overflow-x-hidden overscroll-contain rounded-none border-border p-0">
        <div className="space-y-2 px-6 pb-5 pt-6 pr-14">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </DialogDescription>
        </div>

        {canPublish ? (
          <div className="mx-6 mb-5 min-w-0 border border-border bg-background p-4">
            <p className="text-xs text-muted-foreground">
              {liveUrl ? t("liveUrl") : t("yourUrl")}
            </p>
            {liveUrl ? (
              <div className="mt-2 flex min-w-0 items-center gap-2">
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="min-w-0 flex-1 truncate font-mono text-sm text-foreground underline-offset-4 hover:underline"
                >
                  {stripProtocol(liveUrl)}
                </a>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => void copyUrl()}
                    className="inline-flex size-8 cursor-pointer items-center justify-center border border-border text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
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
                    className="inline-flex size-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                    aria-label={t("openLive")}
                  >
                    <HugeiconsIcon
                      icon={LinkSquare02Icon}
                      className="size-3.5"
                    />
                  </a>
                </div>
              </div>
            ) : (
              <p className="mt-2 break-all font-mono text-sm text-foreground">
                *.{FLORAS_SITES_DOMAIN}
              </p>
            )}
            {!liveUrl ? (
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {t("uniqueAddress")}
              </p>
            ) : null}
            {pendingCustom ? (
              <p className="mt-3 min-w-0 text-xs text-muted-foreground">
                {t("pendingCustom")}{" "}
                <span className="break-all font-mono text-foreground">
                  {pendingCustom}
                </span>
              </p>
            ) : null}
            {customActive && florasUrl ? (
              <p className="mt-3 min-w-0 truncate font-mono text-[11px] text-muted-foreground">
                {t("alsoAt", { url: stripProtocol(florasUrl) })}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="space-y-3 border-t border-border px-6 py-5">
          {canPublish && isPublished ? (
            <>
              <div className="grid min-w-0 gap-2 sm:grid-cols-2">
                {liveUrl ? (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: "brand" }),
                      "h-11 w-full min-w-0"
                    )}
                  >
                    <HugeiconsIcon
                      icon={LinkSquare02Icon}
                      className="size-3.5 shrink-0"
                    />
                    {t("openSite")}
                  </a>
                ) : null}
                <Button
                  type="button"
                  variant={liveUrl ? "outline" : "brand"}
                  className={cn("h-11 w-full min-w-0", !liveUrl && "sm:col-span-2")}
                  onClick={onConfirm}
                  disabled={busy}
                >
                  {publishing ? (
                    <>
                      <HugeiconsIcon
                        icon={Loading03Icon}
                        className="size-3.5 animate-spin"
                      />
                      {t("publishing")}
                    </>
                  ) : (
                    t("updateLive")
                  )}
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                {onExport ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-0 text-muted-foreground"
                    onClick={onExport}
                    disabled={busy}
                  >
                    {exporting ? (
                      <>
                        <HugeiconsIcon
                          icon={Loading03Icon}
                          className="size-3.5 animate-spin"
                        />
                        {t("exporting")}
                      </>
                    ) : (
                      <>
                        <HugeiconsIcon
                          icon={Download01Icon}
                          className="size-3.5"
                        />
                        {t("exportZip")}
                      </>
                    )}
                  </Button>
                ) : (
                  <span />
                )}
                {onUnpublish ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-0 text-destructive hover:bg-transparent hover:text-destructive"
                    onClick={onUnpublish}
                    disabled={busy}
                  >
                    {unpublishing ? (
                      <>
                        <HugeiconsIcon
                          icon={Loading03Icon}
                          className="size-3.5 animate-spin"
                        />
                        {t("unpublishing")}
                      </>
                    ) : (
                      t("unpublish")
                    )}
                  </Button>
                ) : null}
              </div>
            </>
          ) : canPublish ? (
            <>
              <Button
                type="button"
                variant="brand"
                className="h-11 w-full"
                onClick={onConfirm}
                disabled={busy}
              >
                {publishing ? (
                  <>
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      className="size-3.5 animate-spin"
                    />
                    {t("publishing")}
                  </>
                ) : (
                  t("publishSite")
                )}
              </Button>
              {onExport ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full"
                  onClick={onExport}
                  disabled={busy}
                >
                  {exporting ? (
                    <>
                      <HugeiconsIcon
                        icon={Loading03Icon}
                        className="size-3.5 animate-spin"
                      />
                      {t("exporting")}
                    </>
                  ) : (
                    <>
                      <HugeiconsIcon
                        icon={Download01Icon}
                        className="size-3.5"
                      />
                      {t("exportZip")}
                    </>
                  )}
                </Button>
              ) : null}
            </>
          ) : (
            <>
              {onUpgrade ? (
                <Button
                  type="button"
                  variant="brand"
                  className="h-11 w-full"
                  onClick={onUpgrade}
                >
                  {t("upgradeHosting")}
                </Button>
              ) : null}
              {onExport ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full"
                  onClick={onExport}
                  disabled={busy}
                >
                  {exporting ? (
                    <>
                      <HugeiconsIcon
                        icon={Loading03Icon}
                        className="size-3.5 animate-spin"
                      />
                      {t("exporting")}
                    </>
                  ) : (
                    <>
                      <HugeiconsIcon
                        icon={Download01Icon}
                        className="size-3.5"
                      />
                      {t("exportZip")}
                    </>
                  )}
                </Button>
              ) : null}
            </>
          )}

          {canPublish ? (
            <p className="pt-1 text-xs text-muted-foreground">
              {t("manageDomainsBefore")}{" "}
              <Link
                href="/dashboard/account"
                className="text-foreground underline-offset-4 hover:underline"
                onClick={() => {
                  onOpenChange(false);
                  queueMicrotask(() => {
                    window.location.hash = "domains";
                  });
                }}
              >
                {t("manageDomainsLink")}
              </Link>
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
