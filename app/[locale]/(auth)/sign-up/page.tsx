import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { AuthFormFromParams } from "@/components/auth/auth-form-from-params";
import { noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sign up",
  robots: noIndexRobots,
};

export default function SignUpPage() {
  return (
    <AuthPageShell>
      <AuthFormFromParams flow="signUp" />
    </AuthPageShell>
  );
}
