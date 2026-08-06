"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Copy01Icon,
  Loading03Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { useTranslations } from "next-intl";
import { api } from "@/convex/_generated/api";
import { AccountSection } from "@/components/account/account-section";
import { Button } from "@/components/ui/button";
import {
  BillingGateModals,
  useBillingGates,
} from "@/components/billing/billing-gates";
import { AppError, assertOk } from "@/lib/errors";
import { cn } from "@/lib/utils";
import type { DomainStatus, PublishStatus } from "@/lib/publish/types";

type ProjectRow = {
  _id: string;
  publishStatus?: PublishStatus;
  cfSubdomain?: string;
  publishedUrl?: string;
  customDomain?: string;
  customDomainStatus?: DomainStatus;
  customDomainError?: string;
};

function statusLabel(
  status: DomainStatus,
  t: (key: "active" | "pending" | "error" | "blocked" | "deactivated") => string
): string {
  switch (status) {
    case "active":
      return t("active");
    case "pending":
    case "initializing":
      return t("pending");
    case "error":
      return t("error");
    case "blocked":
      return t("blocked");
    case "deactivated":
      return t("deactivated");
    default: {
      const _exhaustive: never = status;
      return String(_exhaustive);
    }
  }
}

async function mutateDomain(
  method: "POST" | "DELETE" | "GET",
  projectId: string,
  domain?: string
): Promise<void> {
  const res =
    method === "GET"
      ? await fetch(
          `/api/domains?projectId=${encodeURIComponent(projectId)}`
        )
      : await fetch("/api/domains", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            method === "POST" ? { projectId, domain } : { projectId }
          ),
        });
  await assertOk(res);
}

function ProjectDomainCard({ project }: { project: ProjectRow }) {
  const t = useTranslations("account.domains");
  const tCommon = useTranslations("common");
  const [domainInput, setDomainInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const subdomain = project.cfSubdomain ?? null;
  const customDomain = project.customDomain ?? null;
  const status = project.customDomainStatus;
  const publishedUrl =
    project.publishedUrl ??
    (subdomain ? `https://${subdomain}` : null);

  async function run(action: () => Promise<void>) {
    setLoading(true);
    setError(null);
    try {
      await action();
    } catch (e) {
      setError(AppError.from(e).message);
    } finally {
      setLoading(false);
    }
  }

  function connectDomain() {
    void run(async () => {
      await mutateDomain("POST", project._id, domainInput);
      setDomainInput("");
    });
  }

  async function copyCname() {
    if (!customDomain || !subdomain) return;
    await navigator.clipboard.writeText(`${customDomain} ${subdomain}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="border border-border/60 p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {customDomain ? (
            <>
              <p className="truncate font-mono text-sm font-medium text-foreground">
                {customDomain}
              </p>
              {subdomain && publishedUrl ? (
                <a
                  href={publishedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block truncate font-mono text-[11px] text-muted-foreground underline-offset-4 hover:underline"
                >
                  {subdomain}
                </a>
              ) : null}
            </>
          ) : subdomain && publishedUrl ? (
            <a
              href={publishedUrl}
              target="_blank"
              rel="noreferrer"
              className="block truncate font-mono text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              {subdomain}
            </a>
          ) : (
            <p className="text-sm font-medium text-foreground">
              {t("publishedSite")}
            </p>
          )}
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/build/${project._id}`}>{tCommon("open")}</Link>
        </Button>
      </div>

      {!customDomain ? (
        <div className="mt-4 flex flex-col gap-3">
          <div>
            <label
              htmlFor={`domain-${project._id}`}
              className="text-xs font-medium text-muted-foreground"
            >
              {t("customDomain")}
            </label>
            <input
              id={`domain-${project._id}`}
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="www.example.com"
              disabled={loading}
              className="mt-1.5 flex h-10 w-full border border-border bg-background px-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              onKeyDown={(e) => {
                if (e.key === "Enter") connectDomain();
              }}
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div>
            <Button
              onClick={connectDomain}
              disabled={loading || !domainInput.trim()}
              className="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              {loading ? (
                <>
                  <HugeiconsIcon icon={Loading03Icon} className="size-3.5 animate-spin" />
                  {t("connecting")}
                </>
              ) : (
                t("connect")
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {status ? (
              <p
                className={cn(
                  "text-xs",
                  status === "active"
                    ? "text-foreground"
                    : status === "error" || status === "blocked"
                      ? "text-destructive"
                      : "text-muted-foreground"
                )}
              >
                {statusLabel(status, (key) => t(`status.${key}`))}
              </p>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={loading}
                onClick={() =>
                  void run(() => mutateDomain("GET", project._id))
                }
              >
                {loading ? (
                  <HugeiconsIcon icon={Loading03Icon} className="size-3.5 animate-spin" />
                ) : (
                  t("checkStatus")
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={loading}
                onClick={() =>
                  void run(() => mutateDomain("DELETE", project._id))
                }
              >
                {tCommon("remove")}
              </Button>
            </div>
          </div>

          {project.customDomainError ? (
            <p className="text-sm text-destructive">
              {project.customDomainError}
            </p>
          ) : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          {subdomain ? (
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {t("dnsRecords")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("dnsHint")}
              </p>
              <div className="mt-3 border border-border/60 bg-background/60 px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    CNAME
                  </span>
                  <button
                    type="button"
                    className="inline-flex size-7 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                    onClick={() => void copyCname()}
                    aria-label={t("copyCname")}
                  >
                    {copied ? (
                      <HugeiconsIcon icon={Tick02Icon} className="size-3.5" />
                    ) : (
                      <HugeiconsIcon icon={Copy01Icon} className="size-3.5" />
                    )}
                  </button>
                </div>
                <p className="mt-1 break-all font-mono text-[12px]">
                  <span className="text-muted-foreground">{t("cnameName")} </span>
                  {customDomain}
                </p>
                <p className="mt-0.5 break-all font-mono text-[12px]">
                  <span className="text-muted-foreground">{t("cnameValue")} </span>
                  {subdomain}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function DomainsSection() {
  const t = useTranslations("account.domains");
  const tCommon = useTranslations("common");
  const projects = useQuery(api.projects.list, {}) as
    | ProjectRow[]
    | undefined;
  const {
    canPublish,
    billingReady,
    hasByokPlan,
    hasSubscription,
    openUpgrade,
    upgradeOpen,
    setUpgradeOpen,
    topUpOpen,
    setTopUpOpen,
  } = useBillingGates();

  const published =
    projects?.filter(
      (p) =>
        p.publishStatus === "published" &&
        Boolean(p.cfSubdomain || p.publishedUrl)
    ) ?? [];

  let body: ReactNode;
  if (!billingReady || projects === undefined) {
    body = <p className="text-sm text-muted-foreground">{tCommon("loading")}</p>;
  } else if (!canPublish) {
    body = (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          {!hasSubscription
            ? t("requirePro")
            : hasByokPlan
              ? t("requireProByok")
              : t("requirePro")}
        </p>
        <Button
          variant="outline"
          className="w-fit rounded-none"
          onClick={openUpgrade}
        >
          {t("upgradePro")}
        </Button>
      </div>
    );
  } else if (published.length === 0) {
    body = (
      <p className="text-sm text-muted-foreground">{t("nonePublished")}</p>
    );
  } else {
    body = (
      <div className="flex max-w-2xl flex-col gap-3">
        {published.map((project) => (
          <ProjectDomainCard key={project._id} project={project} />
        ))}
      </div>
    );
  }

  return (
    <AccountSection
      id="domains"
      title={t("title")}
      description={t("description")}
    >
      {body}
      <BillingGateModals
        upgradeOpen={upgradeOpen}
        topUpOpen={topUpOpen}
        onUpgradeOpenChange={setUpgradeOpen}
        onTopUpOpenChange={setTopUpOpen}
        defaultTier="pro"
      />
    </AccountSection>
  );
}
