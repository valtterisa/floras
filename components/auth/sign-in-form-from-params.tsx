"use client";

import { useSearchParams } from "next/navigation";
import { SignInForm } from "@/components/auth/sign-in-form";

export function SignInFormFromParams() {
  const params = useSearchParams();
  return <SignInForm pendingPrompt={params.get("prompt")} />;
}
