"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Delete02Icon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  buildPreviewFixPrompt,
  detectPreviewLogErrors,
  requestPreviewFix,
  type PreviewLogIssue,
} from "@/lib/workspace/detect-preview-errors";

const MAX_LINES = 500;
const POLL_MS = 4_000;
const MIN_HEIGHT = 120;
const MAX_HEIGHT = 560;
const DEFAULT_HEIGHT = 160;

export function PreviewConsole({
  projectId,
  sandboxName,
  active,
  busy = false,
}: {
  projectId: string;
  sandboxName?: string;
  active: boolean;
  busy?: boolean;
}) {
  const t = useTranslations("preview");
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [lines, setLines] = useState<string[]>([]);
  const [issue, setIssue] = useState<PreviewLogIssue | null>(null);
  const [dismissed, setDismissed] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef(true);
  const dragRef = useRef<{ startY: number; startH: number } | null>(null);

  useEffect(() => {
    if (!sandboxName || !active) {
      setIssue(null);
      return;
    }

    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch("/api/preview/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId }),
          credentials: "same-origin",
          cache: "no-store",
        });
        if (!res.ok || cancelled) return;
        const data = (await res.json().catch(() => ({}))) as { logs?: string };
        const raw = typeof data.logs === "string" ? data.logs : "";
        const next = raw.split(/\r?\n/).filter(Boolean);
        setLines(next.length > MAX_LINES ? next.slice(-MAX_LINES) : next);
        setIssue(detectPreviewLogErrors(raw));
      } catch {
        /* ignore transient poll failures */
      }
    };

    void poll();
    const id = window.setInterval(() => void poll(), POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [sandboxName, active, projectId]);

  useEffect(() => {
    if (!open || !stickRef.current) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, open]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const next = drag.startH + (drag.startY - event.clientY);
      setHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, next)));
    };
    const onUp = () => {
      dragRef.current = null;
      document.body.style.removeProperty("cursor");
      document.body.style.removeProperty("user-select");
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  if (!sandboxName) return null;

  const showFix = issue && issue.fingerprint !== dismissed && !busy;

  return (
    <div className="shrink-0 border-t border-border/60 bg-background">
      {showFix ? (
        <div className="flex items-center gap-2 px-3 py-2">
          <p className="min-w-0 flex-1 truncate text-xs text-destructive">
            {issue.summary}
          </p>
          <button
            type="button"
            onClick={() => {
              requestPreviewFix(buildPreviewFixPrompt(issue));
              setDismissed(issue.fingerprint);
              setOpen(true);
            }}
            className="inline-flex h-7 shrink-0 cursor-pointer items-center gap-1.5 border border-border px-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground transition-colors hover:bg-card"
          >
            <HugeiconsIcon icon={Wrench01Icon} className="size-3" />
            {t("console.fixInChat")}
          </button>
          <button
            type="button"
            onClick={() => setDismissed(issue.fingerprint)}
            className="shrink-0 cursor-pointer text-xs text-muted-foreground hover:text-foreground"
          >
            {t("console.dismiss")}
          </button>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-full cursor-pointer items-center gap-2 px-3 text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
        aria-expanded={open}
      >
        <HugeiconsIcon
          icon={open ? ArrowDown01Icon : ArrowUp01Icon}
          className="size-3.5"
        />
        <span>{t("console.title")}</span>
        {showFix ? (
          <span className="ml-1 size-1.5 bg-destructive" />
        ) : null}
      </button>

      {open ? (
        <>
          <div
            role="separator"
            aria-orientation="horizontal"
            aria-label={t("console.resize")}
            onPointerDown={(event) => {
              event.preventDefault();
              dragRef.current = { startY: event.clientY, startH: height };
              document.body.style.cursor = "row-resize";
              document.body.style.userSelect = "none";
            }}
            className="flex h-2 cursor-row-resize items-center justify-center border-t border-border/40 bg-[#0c0c0c]"
          >
            <span className="h-0.5 w-8 rounded-full bg-white/20" />
          </div>
          <div
            className="flex flex-col bg-[#0c0c0c]"
            style={{ height }}
          >
            <div className="flex items-center justify-end border-b border-white/5 px-3 py-1">
              <button
                type="button"
                onClick={() => setLines([])}
                className="inline-flex cursor-pointer items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/35 hover:text-white/70"
              >
                <HugeiconsIcon icon={Delete02Icon} className="size-3" />
                {t("console.clear")}
              </button>
            </div>
            <div
              className="min-h-0 flex-1 overflow-auto px-3 py-2 font-mono text-[11px] leading-relaxed text-white/75"
              onScroll={(e) => {
                const el = e.currentTarget;
                stickRef.current =
                  el.scrollHeight - el.scrollTop - el.clientHeight < 48;
              }}
            >
              {lines.length === 0 ? (
                <p className="text-white/30">{t("console.empty")}</p>
              ) : (
                lines.map((line, i) => (
                  <div
                    key={`${i}-${line.slice(0, 20)}`}
                    className={cn(
                      "whitespace-pre-wrap break-all",
                      ERROR_HINT.test(line) && "text-red-300"
                    )}
                  >
                    {line}
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

const ERROR_HINT = /\b(error|exception|failed|cannot find)\b/i;
