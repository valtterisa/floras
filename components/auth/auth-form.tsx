"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type AgentModelId,
} from "@/lib/ai/models";
import { cn } from "@/lib/utils";

export type AuthFlow = "signIn" | "signUp";

export type AuthFormProps = {
  flow: AuthFlow;
  pendingPrompt?: string | null;
  pendingModelId?: AgentModelId | null;
  nextPath?: string | null;
  variant?: "page" | "modal";
  className?: string;
};

function buildAuthHref(
  path: "/login" | "/sign-up",
  opts: {
    prompt?: string | null;
    nextPath?: string | null;
    modelId?: string | null;
  }
) {
  const params = new URLSearchParams();
  if (opts.prompt) params.set("prompt", opts.prompt);
  if (opts.nextPath) params.set("next", opts.nextPath);
  if (opts.modelId) params.set("modelId", opts.modelId);
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

export function AuthForm({
  flow,
  pendingPrompt = null,
  pendingModelId = null,
  nextPath = null,
  variant = "page",
  className,
}: AuthFormProps) {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [prompt] = useState(pendingPrompt);

  async function finishAuthenticated() {
    if (prompt) {
      router.push(`/dashboard?prompt=${encodeURIComponent(prompt)}`);
      return;
    }
    if (nextPath?.startsWith("/") && !nextPath.startsWith("//")) {
      router.push(nextPath);
      return;
    }
    router.push("/dashboard");
  }

  async function onPasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("flow", flow);
    setLoading(true);
    try {
      await signIn("password", formData);
      await finishAuthenticated();
    } catch {
      toast.error("Authentication failed. Check your email and password.");
      setLoading(false);
    }
  }

  const isModal = variant === "modal";
  const isSignUp = flow === "signUp";
  const switchHref = buildAuthHref(isSignUp ? "/login" : "/sign-up", {
    prompt,
    nextPath,
    modelId: pendingModelId,
  });

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "flex flex-col",
          isModal ? "text-left" : "items-start text-left"
        )}
      >
        {!isModal ? (
          <div className="mb-6">
            <Logo />
          </div>
        ) : null}
        <h1
          className={cn(
            "font-semibold tracking-tight",
            isModal ? "text-xl" : "text-2xl md:text-3xl"
          )}
        >
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 max-w-[40ch] text-sm leading-relaxed text-muted-foreground">
          {prompt
            ? "Sign in to start creating your site."
            : "Create websites with a live preview — no coding needed."}
        </p>
      </div>

      <form
        onSubmit={onPasswordSubmit}
        className="mt-8 flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@studio.com"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete={isSignUp ? "new-password" : "current-password"}
            placeholder="••••••••"
          />
        </div>
        <Button
          type="submit"
          variant="brand"
          size="lg"
          disabled={loading}
          className="mt-1 w-full"
        >
          {loading
            ? prompt
              ? "Starting…"
              : "Please wait…"
            : isSignUp
              ? "Create account"
              : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 border-t border-border pt-5 text-sm text-muted-foreground">
        {isSignUp ? "Already have an account?" : "New to Floras?"}{" "}
        <Link
          href={switchHref}
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground underline underline-offset-4 transition-colors hover:text-brand"
        >
          {isSignUp ? "Sign in" : "Create one"}
        </Link>
      </p>
    </div>
  );
}
