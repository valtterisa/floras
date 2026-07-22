import { Workspace } from "@/components/workspace/workspace";

export default async function BuildPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <Workspace projectId={projectId} />;
}
