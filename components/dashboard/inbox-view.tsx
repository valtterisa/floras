"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { EmptyState } from "@/components/site/empty-state";
import { PageHeader } from "@/components/site/page-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Submission = {
  _id: Id<"formSubmissions">;
  projectId: Id<"projects">;
  createdAt: number;
  fields: Record<string, string>;
  pagePath?: string;
  status: "new" | "read" | "archived";
  projectName: string;
};

function formatWhen(ts: number): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(ts));
  } catch {
    return new Date(ts).toLocaleString();
  }
}

function previewLine(
  fields: Record<string, string>,
  fallback: string
): string {
  return (
    fields.message ||
    fields.email ||
    fields.name ||
    Object.values(fields)[0] ||
    fallback
  );
}

export function InboxView() {
  const t = useTranslations("inbox");
  const [selectedId, setSelectedId] = useState<Id<"formSubmissions"> | null>(
    null
  );
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [showArchived, setShowArchived] = useState(false);
  const submissions = useQuery(api.forms.listForUser, {
    includeArchived: showArchived,
  }) as Submission[] | undefined;
  const setStatus = useMutation(api.forms.setStatus);

  const projects = useMemo(() => {
    if (!submissions) return [];
    const map = new Map<string, string>();
    for (const s of submissions) {
      map.set(s.projectId, s.projectName);
    }
    return [...map.entries()].map(([id, name]) => ({ id, name }));
  }, [submissions]);

  const filtered = useMemo(() => {
    if (!submissions) return undefined;
    return submissions.filter((s) => {
      if (projectFilter !== "all" && s.projectId !== projectFilter) return false;
      if (showArchived) return s.status === "archived";
      return s.status !== "archived";
    });
  }, [submissions, projectFilter, showArchived]);

  const selected =
    filtered?.find((s) => s._id === selectedId) ?? filtered?.[0] ?? null;

  async function mark(status: "read" | "archived" | "new") {
    if (!selected) return;
    await setStatus({ submissionId: selected._id, status });
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
      <PageHeader title={t("title")} description={t("description")} />

      <div className="flex flex-wrap items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={t("site")}
            className={cn(
              "inline-flex h-9 min-w-0 max-w-full cursor-pointer items-center gap-2 border border-border bg-background px-2.5 text-left text-muted-foreground transition-colors",
              "hover:bg-card hover:text-foreground",
              "focus:outline-none data-[state=open]:bg-card data-[state=open]:text-foreground"
            )}
          >
            <span className="text-xs text-muted-foreground">{t("site")}</span>
            <span className="min-w-0 truncate text-xs font-medium text-foreground">
              {projectFilter === "all"
                ? t("allSites")
                : (projects.find((p) => p.id === projectFilter)?.name ??
                  t("allSites"))}
            </span>
            <HugeiconsIcon icon={ArrowDown01Icon} className="size-3.5 shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="min-w-48 rounded-none border-border p-0 shadow-none"
          >
            <DropdownMenuItem
              onSelect={() => setProjectFilter("all")}
              className={cn(
                "cursor-pointer gap-3 rounded-none px-3 py-2.5 focus:bg-card",
                projects.length > 0 && "border-b border-border",
                projectFilter === "all" && "bg-card"
              )}
            >
              <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                {t("allSites")}
              </span>
              {projectFilter === "all" ? (
                <HugeiconsIcon
                  icon={Tick02Icon}
                  className="size-4 shrink-0 text-brand"
                />
              ) : (
                <span className="size-4 shrink-0" aria-hidden />
              )}
            </DropdownMenuItem>
            {projects.map((p, i) => {
              const active = projectFilter === p.id;
              return (
                <DropdownMenuItem
                  key={p.id}
                  onSelect={() => setProjectFilter(p.id)}
                  className={cn(
                    "cursor-pointer gap-3 rounded-none px-3 py-2.5 focus:bg-card",
                    i < projects.length - 1 && "border-b border-border",
                    active && "bg-card"
                  )}
                >
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                    {p.name}
                  </span>
                  {active ? (
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      className="size-4 shrink-0 text-brand"
                    />
                  ) : (
                    <span className="size-4 shrink-0" aria-hidden />
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          type="button"
          onClick={() => setShowArchived((v) => !v)}
          className={cn(
            "h-9 border border-border px-3 text-sm transition-colors",
            showArchived
              ? "bg-foreground text-background"
              : "bg-background text-muted-foreground hover:text-foreground"
          )}
        >
          {showArchived ? t("showingArchived") : t("showArchived")}
        </button>
      </div>

      {filtered === undefined ? (
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={showArchived ? t("emptyArchivedTitle") : t("emptyTitle")}
          description={
            showArchived
              ? t("emptyArchivedDescription")
              : t("emptyDescription")
          }
        />
      ) : (
        <div className="grid min-h-0 flex-1 gap-4 md:grid-cols-[minmax(240px,320px)_1fr]">
          <ul className="max-h-[70vh] overflow-y-auto border border-border">
            {filtered.map((s) => {
              const active = selected?._id === s._id;
              return (
                <li key={s._id} className="border-b border-border last:border-b-0">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(s._id);
                      if (s.status === "new") {
                        void setStatus({
                          submissionId: s._id,
                          status: "read",
                        });
                      }
                    }}
                    className={cn(
                      "flex w-full flex-col gap-1 px-3 py-3 text-left transition-colors",
                      active
                        ? "bg-muted/60"
                        : "hover:bg-muted/40",
                      s.status === "new" && "font-medium"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm text-foreground">
                        {s.fields.name || s.fields.email || t("visitor")}
                      </span>
                      {s.status === "new" ? (
                        <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                      ) : null}
                    </div>
                    <span className="truncate text-xs text-muted-foreground">
                      {s.projectName}
                    </span>
                    <span className="line-clamp-2 text-xs text-muted-foreground">
                      {previewLine(s.fields, t("submission"))}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {selected ? (
            <div className="border border-border p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold tracking-tight">
                    {selected.fields.name ||
                      selected.fields.email ||
                      t("visitor")}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selected.projectName}
                    {selected.pagePath ? ` · ${selected.pagePath}` : ""}
                    {" · "}
                    {formatWhen(selected.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {selected.status !== "archived" ? (
                    <button
                      type="button"
                      onClick={() => void mark("archived")}
                      className="h-9 border border-border px-3 text-sm text-muted-foreground hover:text-foreground"
                    >
                      {t("archive")}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void mark("new")}
                      className="h-9 border border-border px-3 text-sm text-muted-foreground hover:text-foreground"
                    >
                      {t("restore")}
                    </button>
                  )}
                </div>
              </div>
              <dl className="mt-6 space-y-4">
                {Object.entries(selected.fields).map(([key, value]) => (
                  <div key={key}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {key}
                    </dt>
                    <dd className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
