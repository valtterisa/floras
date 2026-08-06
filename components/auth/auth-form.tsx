"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { ConvexError } from "convex/values";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
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

function buildRedirectTo(opts: {
  prompt?: string | null;
  nextPath?: string | null;
}): string {
  if (opts.prompt) {
    return `/dashboard?prompt=${encodeURIComponent(opts.prompt)}`;
  }
  if (opts.nextPath?.startsWith("/") && !opts.nextPath.startsWith("//")) {
    return opts.nextPath;
  }
  return "/dashboard";
}

function passwordAuthErrorMessage(
  error: unknown,
  flow: AuthFlow,
  messages: { emailExists: string; signUpFailed: string; authFailed: string }
): string {
  const parts: string[] = [];
  if (error instanceof ConvexError) {
    parts.push(
      typeof error.data === "string" ? error.data : JSON.stringify(error.data)
    );
  }
  if (error instanceof Error) {
    parts.push(error.message);
  } else {
    parts.push(String(error));
  }
  const raw = parts.join(" ");
  if (
    raw.includes("EMAIL_ALREADY_REGISTERED") ||
    /Account .+ already exists/i.test(raw)
  ) {
    return messages.emailExists;
  }
  if (flow === "signUp") {
    return messages.signUpFailed;
  }
  return messages.authFailed;
}

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
      />
    </svg>
  );
}

export function AuthForm({
  flow,
  pendingPrompt = null,
  pendingModelId = null,
  nextPath = null,
  variant = "page",
  className,
}: AuthFormProps) {
  const t = useTranslations("auth");
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function finishAuthenticated() {
    router.push(buildRedirectTo({ prompt: pendingPrompt, nextPath }));
  }

  async function onPasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("flow", flow);
    setLoading(true);
    try {
      await signIn("password", formData);
      await finishAuthenticated();
    } catch (error) {
      toast.error(
        passwordAuthErrorMessage(error, flow, {
          emailExists: t("emailExists"),
          signUpFailed: t("signUpFailed"),
          authFailed: t("authFailed"),
        })
      );
      setLoading(false);
    }
  }

  async function onGoogle() {
    setGoogleLoading(true);
    try {
      await signIn("google", {
        redirectTo: buildRedirectTo({ prompt: pendingPrompt, nextPath }),
      });
    } catch {
      toast.error(t("googleFailed"));
      setGoogleLoading(false);
    }
  }

  const isModal = variant === "modal";
  const isSignUp = flow === "signUp";
  const busy = loading || googleLoading;
  const switchHref = buildAuthHref(isSignUp ? "/login" : "/sign-up", {
    prompt: pendingPrompt,
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
          {isSignUp ? t("signUpTitle") : t("loginTitle")}
        </h1>
        <p className="mt-2 max-w-[40ch] text-sm leading-relaxed text-muted-foreground">
          {pendingPrompt ? t("subtitlePrompt") : t("subtitleDefault")}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-5">
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={busy}
          onClick={() => void onGoogle()}
          className="w-full rounded-none"
        >
          <GoogleMark className="size-4" />
          {googleLoading
            ? "Redirecting…"
            : t("withGoogle")}
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            or email
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={onPasswordSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">{t("email")}</Label>
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
            <Label htmlFor="password">{t("password")}</Label>
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
            disabled={busy}
            className="mt-1 w-full"
          >
            {loading
              ? pendingPrompt
                ? t("starting")
                : t("pleaseWait")
              : isSignUp
                ? t("signUpTitle")
                : t("loginTitle")}
          </Button>
        </form>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        {t("agreeBefore")}{" "}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-foreground"
        >
          {t("agreeTerms")}
        </Link>{" "}
        {t("agreeAnd")}{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-foreground"
        >
          {t("agreePrivacy")}
        </Link>
        {t("agreeAfter")}
      </p>

      <p className="mt-6 border-t border-border pt-5 text-sm text-muted-foreground">
        {isSignUp ? t("hasAccount") : t("noAccount")}{" "}
        <Link
          href={switchHref}
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground underline underline-offset-4 transition-colors hover:text-brand"
        >
          {isSignUp ? t("signInLink") : t("signUpLink")}
        </Link>
      </p>
    </div>
  );
}
