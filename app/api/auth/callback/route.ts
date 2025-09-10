import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPolarCustomer } from "@/lib/polar";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      // Always try to create Polar customer (function handles duplicates gracefully)
      if (data.user.email) {
        try {
          await createPolarCustomer(
            data.user.id,
            data.user.email,
            data.user.user_metadata?.full_name || data.user.email
          );
          console.log(
            "Successfully ensured Polar customer exists for user:",
            data.user.id
          );
        } catch (error) {
          console.error(
            "Failed to create Polar customer for OAuth user:",
            error
          );
          // Don't fail the auth flow if Polar customer creation fails
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      let redirectUrl;
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        redirectUrl = `${origin}${next}`;
      } else if (forwardedHost) {
        redirectUrl = `https://${forwardedHost}${next}`;
      } else {
        redirectUrl = `${origin}${next}`;
      }
      console.log("Redirecting to:", redirectUrl);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
