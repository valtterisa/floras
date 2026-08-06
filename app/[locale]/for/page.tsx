import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MarketingLayout } from "@/components/site/marketing-layout";
import { Reveal } from "@/components/site/reveal";
import { USE_CASES } from "@/lib/pseo/use-cases";
import { routing, type Locale } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: loc } = await params;
  if (!hasLocale(routing.locales, loc)) return {};
  const locale = loc as Locale;
  const t = await getTranslations({ locale, namespace: "useCaseIndex" });
  const siteUrl = getSiteUrl();
  const path = `/${locale}/for`;
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${siteUrl}/${l}/for`;
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

export default async function UseCaseIndexPage({ params }: Props) {
  const { locale: loc } = await params;
  if (!hasLocale(routing.locales, loc)) notFound();
  const locale = loc as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("useCaseIndex");

  return (
    <MarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: t("title"),
            description: t("description"),
            url: `${getSiteUrl()}/${locale}/for`,
            numberOfItems: USE_CASES.length,
            itemListElement: USE_CASES.map((useCase, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: useCase.title[locale],
              url: `${getSiteUrl()}/${locale}/for/${useCase.slugs[locale]}`,
            })),
          }),
        }}
      />
      <section className="border-b border-border px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {t("eyebrow")}
            </p>
            <h1 className="mt-4 max-w-[18ch] text-4xl font-semibold tracking-tight md:text-5xl md:leading-[1.1]">
              {t("title")}
            </h1>
            <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-muted-foreground">
              {t("description")}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
          {USE_CASES.map((useCase) => (
            <Link
              key={useCase.id}
              href={`/for/${useCase.slugs[locale]}`}
              className="border border-border px-4 py-4 transition-colors hover:border-foreground"
            >
              <p className="text-sm font-medium text-foreground">
                {useCase.title[locale]}
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {useCase.description[locale]}
              </p>
            </Link>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-3xl">
          <Link
            href="/vs"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {t("seeComparisons")}
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
