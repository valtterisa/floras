import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CheckoutSuccessClient from "./CheckoutSuccessClient";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Get the current user
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Get checkout session ID from search params
  const checkoutId = (await searchParams.checkout_id) as string;
  const sessionId = (await searchParams.session_id) as string;

  return (
    <CheckoutSuccessClient
      user={user}
      checkoutId={checkoutId}
      sessionId={sessionId}
    />
  );
}
