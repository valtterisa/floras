"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useTranslations } from "next-intl";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { EmptyState } from "@/components/site/empty-state";
import { PageHeader } from "@/components/site/page-header";
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

function previewLine(fields: Record<string, string>): string {
  return (
    fields.message ||
    fields.email ||
    fields.name ||
    Object.values(fields)[0] ||
    "Submission"
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
      <PageHeader
        title="Inbox"
        description="Messages from contact forms on your sites."
      />

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Site
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="h-9 border border-border bg-background px-2 text-foreground"
          >
            <option value="all">All sites</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
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
          {showArchived ? "Showing archived" : "Show archived"}
        </button>
      </div>

      {filtered === undefined ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={showArchived ? "No archived messages" : "Inbox is empty"}
          description={
            showArchived
              ? "Archived submissions will show up here."
              : "When visitors submit a contact form on a published or preview site, their messages land here."
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
                        {s.fields.name || s.fields.email || "Visitor"}
                      </span>
                      {s.status === "new" ? (
                        <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                      ) : null}
                    </div>
                    <span className="truncate text-xs text-muted-foreground">
                      {s.projectName}
                    </span>
                    <span className="line-clamp-2 text-xs text-muted-foreground">
                      {previewLine(s.fields)}
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
                    {selected.fields.name || selected.fields.email || "Visitor"}
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
                      Archive
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void mark("new")}
                      className="h-9 border border-border px-3 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Restore
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
