import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";

const ADMIN_EMAIL = "savonen.emppu@gmail.com";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect("/dashboard");
  }

  // Fetch website count server-side
  const { count: websiteCount, error } = await supabase
    .from("websites")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching website count:", error);
  }

  return <AdminClient websiteCount={websiteCount || 0} />;
}
