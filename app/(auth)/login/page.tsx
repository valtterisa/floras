import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { AuthFormFromParams } from "@/components/auth/auth-form-from-params";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Floras to create and refine your websites.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <AuthPageShell>
      <AuthFormFromParams flow="signIn" />
    </AuthPageShell>
  );
}
