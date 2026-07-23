import { Workspace } from "@/components/workspace/workspace";
import type { ComposerMode } from "@/components/site/prompt-composer";

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
  return <Workspace projectId={projectId} initialMode={initialMode} />;
}
