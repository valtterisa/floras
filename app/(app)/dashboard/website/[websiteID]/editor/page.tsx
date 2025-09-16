import { createClient } from "@/lib/supabase/server";
import EditorPageClient from "@/components/editor/editor-page-client";
import { checkRepoExists } from "@/lib/github";
import { getProjectContext } from "@/lib/project-context";

export default async function EditorPage({
  params,
}: {
  params: { teamID: string; websiteID: string };
}) {
  const { websiteID } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const repoExists = await checkRepoExists(websiteID);
  const projectContext = repoExists ? await getProjectContext(websiteID) : null;

  return (
    <EditorPageClient
      appName={websiteID}
      repoExists={repoExists}
      projectContext={projectContext}
    />
  );
}
