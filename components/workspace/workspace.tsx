"use client";

import { useEffect, useRef, useState } from "react";
import { usePreloadedQuery, type Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChatPanel } from "@/components/workspace/chat-panel";
import { PreviewPane } from "@/components/workspace/preview-pane";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import type { ComposerMode } from "@/components/site/prompt-composer";
import { useStopSandboxOnLeave } from "@/lib/hooks/use-stop-sandbox-on-leave";
import type { WorkspaceProject } from "@/lib/types/user";

const MIN_CHAT_WIDTH = 320;
const MAX_CHAT_WIDTH = 720;
const DEFAULT_CHAT_WIDTH = 440;

export function Workspace({
  projectId,
  initialMode,
  preloadedProject,
}: {
  projectId: string;
  initialMode?: ComposerMode;
  preloadedProject: Preloaded<typeof api.projects.get>;
}) {
  const project = usePreloadedQuery(preloadedProject) as WorkspaceProject | null;
  const [chatWidth, setChatWidth] = useState(DEFAULT_CHAT_WIDTH);
  const dragRef = useRef<{ startX: number; startW: number } | null>(null);

  const busy =
    project?.status === "provisioning" ||
    project?.status === "generating" ||
    project?.publishStatus === "publishing";

  useStopSandboxOnLeave(projectId, project?.sandboxName, { enabled: !busy });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const next = drag.startW + (event.clientX - drag.startX);
      setChatWidth(Math.min(MAX_CHAT_WIDTH, Math.max(MIN_CHAT_WIDTH, next)));
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

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <WorkspaceHeader projectId={projectId} project={project} />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside
          className="relative flex min-h-0 w-full shrink-0 flex-col border-b border-border/60 lg:w-[var(--chat-w)] lg:border-b-0 lg:border-r"
          style={{ ["--chat-w" as string]: `${chatWidth}px` }}
        >
          <ChatPanel
            projectId={projectId}
            project={project}
            busy={busy ?? false}
            defaultMode={initialMode ?? "build"}
          />
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize chat"
            onPointerDown={(event) => {
              event.preventDefault();
              dragRef.current = { startX: event.clientX, startW: chatWidth };
              document.body.style.cursor = "col-resize";
              document.body.style.userSelect = "none";
            }}
            className="absolute inset-y-0 -right-1 z-10 hidden w-2 cursor-col-resize lg:block"
          />
        </aside>
        <section className="min-h-0 flex-1">
          <PreviewPane
            projectId={projectId}
            status={project?.status}
            previewUrl={project?.previewUrl}
            sandboxName={project?.sandboxName}
          />
        </section>
      </div>
    </div>
  );
}
