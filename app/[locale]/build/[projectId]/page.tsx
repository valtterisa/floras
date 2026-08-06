import { preloadQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { Workspace } from "@/components/workspace/workspace";
import type { ComposerMode } from "@/components/site/prompt-composer";
import { api } from "@/convex/_generated/api";
import { asProjectId } from "@/lib/convex/ids";

export default async function BuildPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { projectId } = await params;
  const { mode: modeParam } = await searchParams;
  const initialMode: ComposerMode | undefined =
    modeParam === "ask" || modeParam === "build" ? modeParam : undefined;

  const token = await convexAuthNextjsToken();
  const preloadedProject = await preloadQuery(
    api.projects.get,
    { projectId: asProjectId(projectId) },
    token ? { token } : {}
  );

  return (
    <Workspace
      projectId={projectId}
      initialMode={initialMode}
      preloadedProject={preloadedProject}
    />
  );
}
