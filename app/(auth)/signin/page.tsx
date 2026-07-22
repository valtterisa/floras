import { Suspense } from "react";
import Link from "next/link";
import { SignInFormFromParams } from "@/components/auth/sign-in-form-from-params";

export default function SignInPage() {
  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[15%] top-[20%] h-[380px] w-[380px] rounded-full bg-brand/12 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse 60% 50% at 50% 40%, black 30%, transparent 100%)",
          }}
        />
      </div>
      <Link
        href="/"
        className="absolute left-6 top-6 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Back
      </Link>
      <Suspense fallback={null}>
        <SignInFormFromParams />
      </Suspense>
    </main>
  );
}
