"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import {
  translateComparisonSlug,
  translateUseCaseSlug,
} from "@/lib/pseo/seo-paths";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  function switchLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;

    const slugParam = typeof params.slug === "string" ? params.slug : undefined;

    if (pathname === "/for/[slug]" && slugParam) {
      const nextSlug = translateUseCaseSlug(locale, nextLocale, slugParam);
      if (nextSlug) {
        router.replace(
          { pathname: "/for/[slug]", params: { slug: nextSlug } },
          { locale: nextLocale }
        );
        return;
      }
    }

    if (pathname === "/vs/[slug]" && slugParam) {
      const nextSlug = translateComparisonSlug(locale, nextLocale, slugParam);
      if (nextSlug) {
        router.replace(
          { pathname: "/vs/[slug]", params: { slug: nextSlug } },
          { locale: nextLocale }
        );
        return;
      }
    }

    if (pathname === "/build/[projectId]") {
      const projectId =
        typeof params.projectId === "string" ? params.projectId : undefined;
      if (projectId) {
        router.replace(
          { pathname: "/build/[projectId]", params: { projectId } },
          { locale: nextLocale }
        );
        return;
      }
    }

    router.replace(
      // Static pathnames only; dynamic routes handled above.
      pathname as
        | "/"
        | "/login"
        | "/sign-up"
        | "/signin"
        | "/pricing"
        | "/privacy"
        | "/terms"
        | "/sitemap"
        | "/for"
        | "/vs"
        | "/dashboard"
        | "/dashboard/account"
        | "/dashboard/inbox"
        | "/account",
      { locale: nextLocale }
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground",
        className
      )}
      role="group"
      aria-label={t("language")}
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={cn(
            "px-1.5 py-0.5 transition-colors",
            loc === locale
              ? "bg-foreground text-background"
              : "hover:text-foreground"
          )}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
