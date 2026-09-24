import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import {
  getUseCaseBySlug,
  getUseCaseSlugs,
} from "@/lib/pseo/use-cases";
import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/seo";
import {
  ogContentType,
  ogSize,
  renderOgImage,
} from "@/lib/og/image";

export const alt = siteConfig.name;
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getUseCaseSlugs(locale).map((slug) => ({ locale, slug }))
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: loc, slug } = await params;
  if (!hasLocale(routing.locales, loc)) notFound();
  const locale = loc as Locale;
  const useCase = getUseCaseBySlug(locale, slug);
  if (!useCase) notFound();

  return renderOgImage({
    title: useCase.title[locale],
    description: useCase.description[locale],
  });
}
