import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/seo";
import {
  ogContentType,
  ogSize,
  renderOgImage,
} from "@/lib/og/image";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: loc } = await params;
  if (!hasLocale(routing.locales, loc)) {
    return renderOgImage({
      title: siteConfig.tagline,
      description: siteConfig.description,
    });
  }

  const locale = loc as Locale;
  const t = await getTranslations({ locale, namespace: "meta" });

  return renderOgImage({
    title: t("tagline"),
    description: t("description"),
  });
}
