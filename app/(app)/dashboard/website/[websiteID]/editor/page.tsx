import { createClient } from "@/lib/supabase/server";
import EditorPageClient from "@/components/editor/editor-page-client";

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

  return <EditorPageClient />; // @TODO: add user to the client component
}
