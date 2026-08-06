import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { AuthFormFromParams } from "@/components/auth/auth-form-from-params";
import { noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sign in",
  robots: noIndexRobots,
};

export default function LoginPage() {
  return (
    <AuthPageShell>
      <AuthFormFromParams flow="signIn" />
    </AuthPageShell>
  );
}
