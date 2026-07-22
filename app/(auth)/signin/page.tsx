import { Suspense } from "react";
import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-brand/10 blur-[150px]" />
      </div>
      <Link
        href="/"
        className="absolute left-6 top-6 text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back
      </Link>
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
    </main>
  );
}
