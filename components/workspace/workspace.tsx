"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { ChatPanel } from "@/components/workspace/chat-panel";
import { PreviewPane } from "@/components/workspace/preview-pane";

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
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/60 px-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="size-8">
            <Link href="/dashboard">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <Logo />
          <span className="hidden text-sm text-muted-foreground sm:inline">
            / {project?.name ?? "…"}
          </span>
        </div>
        {project?.previewUrl && (
          <Button asChild variant="outline" size="sm">
            <a href={project.previewUrl} target="_blank" rel="noreferrer">
              Open preview <ExternalLink className="ml-1.5 size-3.5" />
            </a>
          </Button>
        )}
      </header>

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
