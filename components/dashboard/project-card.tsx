import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DashboardProject } from "@/components/dashboard/types";

const STATUS_TONE: Record<string, string> = {
  ready: "border-brand/40 text-brand",
  error: "border-destructive/40 text-destructive",
};

export function ProjectCard({ project }: { project: DashboardProject }) {
  return (
    <Link
      href={`/build/${project._id}`}
      className="group overflow-hidden rounded-2xl border border-border/60 bg-card/40 transition-colors hover:border-border active:scale-[0.995]"
    >
      <div className="aspect-[16/10] overflow-hidden border-b border-border/60 bg-muted/30">
        {project.previewUrl ? (
          <iframe
            src={project.previewUrl}
            title={project.name}
            className="pointer-events-none h-[200%] w-[200%] origin-top-left scale-50"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Preview pending
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 p-4">
        <span className="truncate text-sm font-medium">{project.name}</span>
        <Badge
          variant="outline"
          className={cn(STATUS_TONE[project.status] ?? "text-muted-foreground")}
        >
          {project.status}
        </Badge>
      </div>
    </Link>
  );
}
