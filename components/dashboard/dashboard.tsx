"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Container } from "@/components/site/container";
import { DashboardPrompt } from "@/components/dashboard/dashboard-prompt";
import { ProjectGrid } from "@/components/dashboard/project-grid";
import type { DashboardProject } from "@/components/dashboard/types";

export function Dashboard() {
  const projects = useQuery((api as any).projects.list, {}) as
    | DashboardProject[]
    | undefined;

  return (
    <Container className="py-14 md:py-16">
      <DashboardPrompt />
      <div className="mt-20">
        <ProjectGrid projects={projects} />
      </div>
    </Container>
  );
}
