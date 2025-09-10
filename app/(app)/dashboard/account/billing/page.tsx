import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import BillingClient from "./BillingClient";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  // Get Supabase user on the server
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) {
    // Optionally, redirect to login or show an error
    redirect("/login");
  }

  return <BillingClient user={user} />;
}
