import { EmptyState } from "@/components/site/empty-state";
import { ProjectCard } from "@/components/dashboard/project-card";
import type { DashboardProject } from "@/components/dashboard/types";

export function ProjectGrid({
  projects,
}: {
  projects: DashboardProject[] | undefined;
}) {
  return (
    <div>
      <h2 className="text-sm font-medium text-muted-foreground">Your sites</h2>
      {projects === undefined ? (
        <EmptyState title="Loading…" className="mt-2" />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No sites yet"
          description="Your first generation will show up here."
          className="mt-2"
        />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
