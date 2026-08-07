import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MarketingLayout } from "@/components/site/marketing-layout";
import { Reveal } from "@/components/site/reveal";
import {
  STATIC_SEO_PATHS,
  getComparisonSeoPaths,
  getUseCaseSeoPaths,
  absoluteUrl,
} from "@/lib/pseo/seo-paths";
import { USE_CASES } from "@/lib/pseo/use-cases";
import { COMPARISONS } from "@/lib/pseo/comparisons";
import { localizedPath, routing, type Locale } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: loc } = await params;
  if (!hasLocale(routing.locales, loc)) return {};
  const locale = loc as Locale;
  const t = await getTranslations({ locale, namespace: "htmlSitemap" });
  const siteUrl = getSiteUrl();
  const path = localizedPath(locale, "sitemap");
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${siteUrl}${localizedPath(l, "sitemap")}`;
  }

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: path, languages },
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale === "fi" ? "fi_FI" : "en_US",
      url: path,
    },
  };
}

export default async function HtmlSitemapPage({ params }: Props) {
  const { locale: loc } = await params;
  if (!hasLocale(routing.locales, loc)) notFound();
  const locale = loc as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("htmlSitemap");
  const useCases = getUseCaseSeoPaths();
  const comparisons = getComparisonSeoPaths();
  const core = STATIC_SEO_PATHS.filter((p) => p.id !== "sitemap");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("title"),
    description: t("description"),
    url: absoluteUrl(localizedPath(locale, "sitemap")),
    numberOfItems: core.length + useCases.length + comparisons.length,
    itemListElement: [...core, ...useCases, ...comparisons].map(
      (entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: entry.title[locale],
        url: absoluteUrl(entry.pathByLocale[locale]),
      })
    ),
  };

  return (
    <MarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="border-b border-border px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {t("eyebrow")}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-5 max-w-[48ch] text-base leading-relaxed text-muted-foreground">
              {t("description")}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              <a
                href="/sitemap.xml"
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                {t("xmlSitemap")}
              </a>
              {" · "}
              <a
                href="/llms.txt"
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                llms.txt
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      <SitemapSection title={t("core")}>
        <li>
          <Link
            href="/"
            className="block border border-border px-3 py-3 transition-colors hover:border-foreground"
          >
            <span className="text-sm font-medium text-foreground">
              {core.find((c) => c.id === "home")?.title[locale]}
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/for"
            className="block border border-border px-3 py-3 transition-colors hover:border-foreground"
          >
            <span className="text-sm font-medium text-foreground">
              {core.find((c) => c.id === "for-index")?.title[locale]}
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/vs"
            className="block border border-border px-3 py-3 transition-colors hover:border-foreground"
          >
            <span className="text-sm font-medium text-foreground">
              {core.find((c) => c.id === "vs-index")?.title[locale]}
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/privacy"
            className="block border border-border px-3 py-3 transition-colors hover:border-foreground"
          >
            <span className="text-sm font-medium text-foreground">
              {core.find((c) => c.id === "privacy")?.title[locale]}
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/terms"
            className="block border border-border px-3 py-3 transition-colors hover:border-foreground"
          >
            <span className="text-sm font-medium text-foreground">
              {core.find((c) => c.id === "terms")?.title[locale]}
            </span>
          </Link>
        </li>
      </SitemapSection>

      <SitemapSection title={t("useCases")}>
        {USE_CASES.map((useCase) => (
          <li key={useCase.id}>
            <Link
              href={{
                pathname: "/for/[slug]",
                params: { slug: useCase.slugs[locale] },
              }}
              className="block border border-border px-3 py-3 transition-colors hover:border-foreground"
            >
              <span className="text-sm font-medium text-foreground">
                {useCase.title[locale]}
              </span>
              <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-muted-foreground">
                {useCase.description[locale]}
              </span>
            </Link>
          </li>
        ))}
      </SitemapSection>

      <SitemapSection title={t("comparisons")}>
        {COMPARISONS.map((comparison) => (
          <li key={comparison.id}>
            <Link
              href={{
                pathname: "/vs/[slug]",
                params: { slug: comparison.slugs[locale] },
              }}
              className="block border border-border px-3 py-3 transition-colors hover:border-foreground"
            >
              <span className="text-sm font-medium text-foreground">
                {comparison.title[locale]}
              </span>
              <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-muted-foreground">
                {comparison.description[locale]}
              </span>
            </Link>
          </li>
        ))}
      </SitemapSection>
    </MarketingLayout>
  );
}

function SitemapSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-border px-4 py-10 md:px-8 md:py-12">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {title}
        </h2>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">{children}</ul>
      </div>
    </section>
  );
}
