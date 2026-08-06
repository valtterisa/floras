import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { MarketingLayout } from "@/components/site/marketing-layout";
import { Hero } from "@/components/landing/hero";
import { LogoWall } from "@/components/landing/logo-wall";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { CallToAction } from "@/components/landing/cta";
import { SectionGutter } from "@/components/landing/section-gutter";
import { getSiteUrl, siteConfig } from "@/lib/seo";
import { routing, type Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: loc } = await params;
  if (!hasLocale(routing.locales, loc)) return {};
  const locale = loc as Locale;
  const t = await getTranslations({ locale, namespace: "meta" });
  const siteUrl = getSiteUrl();

  return {
    title: {
      absolute: `${siteConfig.name} — ${t("tagline")}`,
    },
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        fi: `${siteUrl}/fi`,
      },
    },
    openGraph: {
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: `${siteConfig.name} — ${t("tagline")}`,
      description: t("description"),
      url: `/${locale}`,
    },
  };
}

export default async function LandingPage({ params }: Props) {
  const { locale: loc } = await params;
  if (!hasLocale(routing.locales, loc)) notFound();
  setRequestLocale(loc);

  const t = await getTranslations({ locale: loc, namespace: "meta" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    description: t("description"),
    url: getSiteUrl(),
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <MarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <LogoWall />
      <Features />
      <SectionGutter />
      <HowItWorks />
      <SectionGutter />
      <Pricing />
      <SectionGutter />
      <CallToAction />
    </MarketingLayout>
  );
}
