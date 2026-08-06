import { routing, type Locale } from "@/i18n/routing";
import { USE_CASES } from "@/lib/pseo/use-cases";
import { COMPARISONS } from "@/lib/pseo/comparisons";
import { getSiteUrl } from "@/lib/seo";

export type SeoPath = {
  id: string;
  pathByLocale: Record<Locale, string>;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
};

export const STATIC_SEO_PATHS: SeoPath[] = [
  {
    id: "home",
    pathByLocale: { en: "/en", fi: "/fi" },
    title: { en: "Floras — AI website builder", fi: "Floras — AI-sivustonrakentaja" },
    description: {
      en: "Describe your business. Get a live website you can refine in chat and publish.",
      fi: "Kuvaile yrityksesi. Saat live-sivuston, jota voit hiota chatissa ja julkaista.",
    },
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    id: "for-index",
    pathByLocale: { en: "/en/for", fi: "/fi/for" },
    title: { en: "Make a website with Floras", fi: "Tee verkkosivut Floraksella" },
    description: {
      en: "Business-type use cases for Floras.",
      fi: "Yritystyyppien käyttötapaukset Florakselle.",
    },
    changeFrequency: "weekly",
    priority: 0.85,
  },
  {
    id: "vs-index",
    pathByLocale: { en: "/en/vs", fi: "/fi/vs" },
    title: {
      en: "Floras vs other website builders",
      fi: "Floras vs muut sivustonrakentajat",
    },
    description: {
      en: "Honest comparisons with WordPress, Wix, and more.",
      fi: "Rehelliset vertailut WordPressiin, Wixiin ja muihin.",
    },
    changeFrequency: "weekly",
    priority: 0.85,
  },
  {
    id: "sitemap",
    pathByLocale: { en: "/en/sitemap", fi: "/fi/sitemap" },
    title: { en: "Sitemap", fi: "Sivukartta" },
    description: {
      en: "HTML sitemap of all public Floras pages.",
      fi: "HTML-sivukartta kaikista Floraksen julkisista sivuista.",
    },
    changeFrequency: "weekly",
    priority: 0.5,
  },
  {
    id: "privacy",
    pathByLocale: { en: "/en/privacy", fi: "/fi/privacy" },
    title: { en: "Privacy", fi: "Tietosuoja" },
    description: {
      en: "Floras privacy policy.",
      fi: "Floraksen tietosuojaseloste.",
    },
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    id: "terms",
    pathByLocale: { en: "/en/terms", fi: "/fi/terms" },
    title: { en: "Terms", fi: "Ehdot" },
    description: {
      en: "Floras terms of service.",
      fi: "Floraksen käyttöehdot.",
    },
    changeFrequency: "yearly",
    priority: 0.3,
  },
];

export function getUseCaseSeoPaths(): SeoPath[] {
  return USE_CASES.map((useCase) => ({
    id: `for-${useCase.id}`,
    pathByLocale: {
      en: `/en/for/${useCase.slugs.en}`,
      fi: `/fi/for/${useCase.slugs.fi}`,
    },
    title: useCase.title,
    description: useCase.description,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
}

export function getComparisonSeoPaths(): SeoPath[] {
  return COMPARISONS.map((comparison) => ({
    id: `vs-${comparison.id}`,
    pathByLocale: {
      en: `/en/vs/${comparison.slugs.en}`,
      fi: `/fi/vs/${comparison.slugs.fi}`,
    },
    title: comparison.title,
    description: comparison.description,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
}

export function getAllSeoPaths(): SeoPath[] {
  return [
    ...STATIC_SEO_PATHS,
    ...getUseCaseSeoPaths(),
    ...getComparisonSeoPaths(),
  ];
}

export function absoluteUrl(path: string): string {
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function languageAlternates(
  pathByLocale: Record<Locale, string>
): Record<string, string> {
  const languages: Record<string, string> = {
    "x-default": absoluteUrl(pathByLocale[routing.defaultLocale]),
  };
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(pathByLocale[locale]);
  }
  return languages;
}
