"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChatPanel } from "@/components/workspace/chat-panel";
import { PreviewPane } from "@/components/workspace/preview-pane";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";

interface Project {
  _id: string;
  name: string;
  status: string;
  previewUrl?: string;
  error?: string;
}

export function Workspace({ projectId }: { projectId: string }) {
  const project = useQuery((api as any).projects.get, { projectId }) as
    | Project
    | null
    | undefined;

  const busy =
    project?.status === "provisioning" ||
    project?.status === "generating" ||
    project?.status === "draft";

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <WorkspaceHeader name={project?.name} previewUrl={project?.previewUrl} />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="flex min-h-0 w-full shrink-0 flex-col border-b border-border/60 lg:w-[440px] lg:border-b-0 lg:border-r">
          <ChatPanel projectId={projectId} busy={busy ?? false} />
        </aside>
        <section className="min-h-0 flex-1">
          <PreviewPane status={project?.status} previewUrl={project?.previewUrl} />
        </section>
      </div>
    </div>
  );
}
