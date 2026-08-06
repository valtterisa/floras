import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MarketingLayout } from "@/components/site/marketing-layout";
import { Reveal } from "@/components/site/reveal";
import {
  COMPARISONS,
  getComparisonBySlug,
  getComparisonSlugs,
} from "@/lib/pseo/comparisons";
import { routing, type Locale } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getComparisonSlugs(locale).map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: loc, slug } = await params;
  if (!hasLocale(routing.locales, loc)) return {};
  const locale = loc as Locale;
  const comparison = getComparisonBySlug(locale, slug);
  if (!comparison) return {};

  const siteUrl = getSiteUrl();
  const path = `/${locale}/vs/${slug}`;
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${siteUrl}/${l}/vs/${comparison.slugs[l]}`;
  }

  return {
    title: comparison.title[locale],
    description: comparison.description[locale],
    keywords: comparison.keywords[locale],
    alternates: {
      canonical: path,
      languages,
    },
    openGraph: {
      title: comparison.title[locale],
      description: comparison.description[locale],
      locale: locale === "fi" ? "fi_FI" : "en_US",
      url: path,
    },
  };
}

export default async function ComparisonPage({ params }: Props) {
  const { locale: loc, slug } = await params;
  if (!hasLocale(routing.locales, loc)) notFound();
  const locale = loc as Locale;
  setRequestLocale(locale);

  const comparison = getComparisonBySlug(locale, slug);
  if (!comparison) notFound();

  const t = await getTranslations("comparison");
  const href = "/" as const;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: comparison.title[locale],
    description: comparison.description[locale],
    url: `${getSiteUrl()}/${locale}/vs/${slug}`,
    about: {
      "@type": "SoftwareApplication",
      name: "Floras",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
    },
    mainEntity: {
      "@type": "ItemList",
      name: comparison.title[locale],
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Floras",
          description: comparison.bestForFloras[locale],
        },
        {
          "@type": "ListItem",
          position: 2,
          name: comparison.competitor,
          description: comparison.bestForCompetitor[locale],
        },
      ],
    },
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
            <h1 className="mt-4 max-w-[22ch] text-4xl font-semibold tracking-tight md:text-5xl md:leading-[1.1]">
              {comparison.title[locale]}
            </h1>
            <p className="mt-5 max-w-[48ch] text-base leading-relaxed text-muted-foreground">
              {comparison.summary[locale]}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={href}
                className="inline-flex h-11 items-center justify-center bg-brand px-6 text-sm font-medium text-brand-foreground transition-[filter] hover:brightness-110"
              >
                {t("cta")}
              </Link>
              <Link
                href="/vs"
                className="inline-flex h-11 items-center justify-center border border-border px-6 text-sm font-medium text-foreground transition-colors hover:border-foreground"
              >
                {t("allComparisons")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-border px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-3xl gap-10 md:grid-cols-2">
          <Reveal>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {t("florasWins", { competitor: comparison.competitor })}
            </h2>
            <ul className="mt-4 space-y-3">
              {comparison.florasWins[locale].map((item) => (
                <li
                  key={item}
                  className="border-l-2 border-brand pl-4 text-sm leading-relaxed text-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {t("competitorWins", { competitor: comparison.competitor })}
            </h2>
            <ul className="mt-4 space-y-3">
              {comparison.competitorWins[locale].map((item) => (
                <li
                  key={item}
                  className="border-l-2 border-border pl-4 text-sm leading-relaxed text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-border px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {t("chooseFloras")}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground">
              {comparison.bestForFloras[locale]}
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {t("chooseCompetitor", { competitor: comparison.competitor })}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {comparison.bestForCompetitor[locale]}
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {t("more")}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {COMPARISONS.filter((c) => c.id !== comparison.id)
              .slice(0, 8)
              .map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/vs/${c.slugs[locale]}`}
                    className="inline-flex border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    {c.title[locale]}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </section>
    </MarketingLayout>
  );
}
