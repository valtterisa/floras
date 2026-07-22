"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateSite } from "@/lib/hooks/use-create-site";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const params = useSearchParams();
  const createSite = useCreateSite();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signUp");
  const [loading, setLoading] = useState(false);

  const pendingPrompt = params.get("prompt");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("flow", flow);
    setLoading(true);
    try {
      await signIn("password", formData);
      if (pendingPrompt) {
        const id = await createSite({ prompt: pendingPrompt });
        router.push(`/build/${id}`);
      } else {
        router.push("/dashboard");
      }
    } catch {
      toast.error("Authentication failed. Check your email and password.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col items-center text-center">
        <Logo />
        <h1 className="mt-8 text-2xl font-semibold tracking-tight">
          {flow === "signUp" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {pendingPrompt
            ? "Sign in to start building your site."
            : "Generate Astro sites with a live preview."}
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@studio.com" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="mt-2 h-11 bg-brand text-brand-foreground hover:bg-brand/90"
        >
          {loading ? "Please wait…" : flow === "signUp" ? "Create account" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {flow === "signUp" ? "Already have an account?" : "New to Nebula?"}{" "}
        <button
          type="button"
          onClick={() => setFlow(flow === "signUp" ? "signIn" : "signUp")}
          className="font-medium text-foreground underline underline-offset-4"
        >
          {flow === "signUp" ? "Sign in" : "Create one"}
        </button>
      </p>
    </div>
  );
}
