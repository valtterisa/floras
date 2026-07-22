import Link from "next/link";
import { cn } from "@/lib/utils";
import type { DashboardProject } from "@/components/dashboard/types";

const STATUS_TONE: Record<string, string> = {
  ready: "text-brand",
  error: "text-destructive",
  generating: "text-muted-foreground",
};

export function ProjectCard({
  project,
  className,
}: {
  project: DashboardProject;
  className?: string;
}) {
  return (
    <Link
      href={`/build/${project._id}`}
      className={cn(
        "group flex flex-col transition-colors hover:bg-white active:scale-[0.995]",
        className
      )}
    >
      <div className="aspect-[16/10] overflow-hidden border-b border-border bg-muted/40">
        {project.previewUrl ? (
          <iframe
            src={project.previewUrl}
            title={project.name}
            className="pointer-events-none h-[200%] w-[200%] origin-top-left scale-50"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Preview pending
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <span className="truncate text-sm font-medium text-foreground">
          {project.name}
        </span>
        <span
          className={cn(
            "shrink-0 font-mono text-[10px] uppercase tracking-[0.14em]",
            STATUS_TONE[project.status] ?? "text-muted-foreground"
          )}
        >
          {project.status}
        </span>
      </div>
    </Link>
  );
}
