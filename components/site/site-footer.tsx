import type { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { USE_CASES } from "@/lib/pseo/use-cases";
import { COMPARISONS } from "@/lib/pseo/comparisons";
import { routing, type Locale } from "@/i18n/routing";

const FEATURED_USE_CASE_IDS = [
  "restaurant",
  "plumber",
  "photographer",
  "lawyer",
  "realtor",
  "salon",
  "consultant",
  "cafe",
] as const;

const FEATURED_COMPARISON_IDS = [
  "wordpress",
  "wix",
  "squarespace",
  "webflow",
  "framer",
  "lovable",
] as const;

function capitalizeLabel(label: string, locale: Locale): string {
  const first = label.charAt(0);
  if (!first) return label;
  return `${first.toLocaleUpperCase(locale)}${label.slice(1)}`;
}

async function resolveLocale(): Promise<Locale> {
  try {
    const locale = await getLocale();
    if (hasLocale(routing.locales, locale)) return locale;
  } catch {
    // Root routes (e.g. /_not-found) sit outside the locale request scope.
  }
  return routing.defaultLocale;
}

export async function SiteFooter() {
  const locale = await resolveLocale();
  const t = await getTranslations({ locale, namespace: "footer" });

  const useCases = FEATURED_USE_CASE_IDS.flatMap((id) => {
    const useCase = USE_CASES.find((item) => item.id === id);
    return useCase ? [useCase] : [];
  });

  const comparisons = FEATURED_COMPARISON_IDS.flatMap((id) => {
    const comparison = COMPARISONS.find((item) => item.id === id);
    return comparison ? [comparison] : [];
  });

  return (
    <footer className="border-t border-border bg-card">
      <div className="grid gap-10 p-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] md:gap-12 md:p-10">
        <div className="flex flex-col justify-between gap-8">
          <div>
            <Logo />
            <p className="mt-5 max-w-[28ch] text-sm leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>
          </div>
          <LocaleSwitcher />
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          <FooterColumn title={t("product")}>
            <li>
              <Link
                href="/"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("home")}
              </Link>
            </li>
            <li>
              <Link
                href="/sitemap"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("sitemap")}
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("privacy")}
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("terms")}
              </Link>
            </li>
          </FooterColumn>

          <FooterColumn
            title={t("useCases")}
            seeAllHref="/for"
            seeAllLabel={t("viewAll")}
          >
            {useCases.map((useCase) => {
              const label =
                useCase.keywords[locale][0] ?? useCase.title[locale];
              return (
                <li key={useCase.id}>
                  <Link
                    href={{
                      pathname: "/for/[slug]",
                      params: { slug: useCase.slugs[locale] },
                    }}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {capitalizeLabel(label, locale)}
                  </Link>
                </li>
              );
            })}
          </FooterColumn>

          <FooterColumn
            title={t("comparisons")}
            seeAllHref="/vs"
            seeAllLabel={t("viewAll")}
          >
            {comparisons.map((comparison) => (
              <li key={comparison.id}>
                <Link
                  href={{
                    pathname: "/vs/[slug]",
                    params: { slug: comparison.slugs[locale] },
                  }}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {comparison.title[locale]}
                </Link>
              </li>
            ))}
          </FooterColumn>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-8 py-4 sm:flex-row md:px-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          &copy; {new Date().getFullYear()} Floras
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          <a
            href="https://quickshops.app"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Quickshops
          </a>
          <a
            href="https://valtterisavonen.fi"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Made by Valtteri Savonen
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  seeAllHref,
  seeAllLabel,
  children,
}: {
  title: string;
  seeAllHref?: "/for" | "/vs";
  seeAllLabel?: string;
  children: ReactNode;
}) {
  return (
    <nav aria-label={title}>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
      {seeAllHref && seeAllLabel ? (
        <Link
          href={seeAllHref}
          className="mt-4 inline-block text-sm text-foreground underline-offset-4 transition-colors hover:underline"
        >
          {seeAllLabel}
        </Link>
      ) : null}
    </nav>
  );
}
