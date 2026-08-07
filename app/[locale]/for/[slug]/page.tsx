import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MarketingLayout } from "@/components/site/marketing-layout";
import { Reveal } from "@/components/site/reveal";
import {
  getUseCaseBySlug,
  getUseCaseSlugs,
  USE_CASES,
} from "@/lib/pseo/use-cases";
import { localizedPath, routing, type Locale } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getUseCaseSlugs(locale).map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: loc, slug } = await params;
  if (!hasLocale(routing.locales, loc)) return {};
  const locale = loc as Locale;
  const useCase = getUseCaseBySlug(locale, slug);
  if (!useCase) return {};

  const siteUrl = getSiteUrl();
  const path = localizedPath(locale, "for", slug);
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${siteUrl}${localizedPath(l, "for", useCase.slugs[l])}`;
  }

  return {
    title: useCase.title[locale],
    description: useCase.description[locale],
    keywords: useCase.keywords[locale],
    alternates: {
      canonical: path,
      languages,
    },
    openGraph: {
      title: useCase.title[locale],
      description: useCase.description[locale],
      locale: locale === "fi" ? "fi_FI" : "en_US",
      url: path,
    },
  };
}

export default async function UseCasePage({ params }: Props) {
  const { locale: loc, slug } = await params;
  if (!hasLocale(routing.locales, loc)) notFound();
  const locale = loc as Locale;
  setRequestLocale(locale);

  const useCase = getUseCaseBySlug(locale, slug);
  if (!useCase) notFound();

  const t = await getTranslations("useCase");
  const prompt = useCase.examplePrompt[locale];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: useCase.title[locale],
    description: useCase.description[locale],
    url: `${getSiteUrl()}${localizedPath(locale, "for", slug)}`,
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
            <h1 className="mt-4 max-w-[18ch] text-4xl font-semibold tracking-tight md:text-5xl md:leading-[1.1]">
              {useCase.title[locale]}
            </h1>
            <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-muted-foreground">
              {useCase.description[locale]}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={{ pathname: "/", query: { prompt } }}
                className="inline-flex h-11 items-center justify-center bg-brand px-6 text-sm font-medium text-brand-foreground transition-[filter] hover:brightness-110"
              >
                {t("cta")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-border px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-3xl gap-10 md:grid-cols-[1fr_1fr]">
          <Reveal>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("proof")}
            </p>
          </Reveal>
          <ul className="space-y-4">
            {useCase.bullets[locale].map((bullet) => (
              <li
                key={bullet}
                className="border-l-2 border-brand pl-4 text-sm leading-relaxed text-foreground"
              >
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-4 py-10 md:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {t("more")}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {USE_CASES.filter((u) => u.id !== useCase.id)
              .slice(0, 8)
              .map((u) => (
                <li key={u.id}>
                  <Link
                    href={{
                      pathname: "/for/[slug]",
                      params: { slug: u.slugs[locale] },
                    }}
                    className="inline-flex border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    {u.title[locale].split(" ").slice(0, 2).join(" ")}
                  </Link>
                </li>
              ))}
          </ul>
          <Link
            href="/for"
            className="mt-6 inline-block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {t("allUseCases")}
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
