import { defineRouting } from "next-intl/routing";

export const locales = ["en", "fi"] as const;
export type Locale = (typeof locales)[number];

export const pathnames = {
  "/": "/",
  "/login": {
    en: "/login",
    fi: "/kirjaudu",
  },
  "/sign-up": {
    en: "/sign-up",
    fi: "/liity",
  },
  "/signin": "/signin",
  "/pricing": {
    en: "/pricing",
    fi: "/hinnasto",
  },
  "/privacy": {
    en: "/privacy",
    fi: "/tietosuoja",
  },
  "/terms": {
    en: "/terms",
    fi: "/ehdot",
  },
  "/sitemap": {
    en: "/sitemap",
    fi: "/sivukartta",
  },
  "/for": {
    en: "/for",
    fi: "/sivustot",
  },
  "/for/[slug]": {
    en: "/for/[slug]",
    fi: "/sivustot/[slug]",
  },
  "/vs": {
    en: "/vs",
    fi: "/vertailu",
  },
  "/vs/[slug]": {
    en: "/vs/[slug]",
    fi: "/vertailu/[slug]",
  },
  "/dashboard": "/dashboard",
  "/dashboard/account": "/dashboard/account",
  "/dashboard/inbox": "/dashboard/inbox",
  "/account": "/account",
  "/build/[projectId]": "/build/[projectId]",
} as const;

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
  pathnames,
});

export type Pathnames = keyof typeof pathnames;

export const localizedPrefixes = {
  for: { en: "for", fi: "sivustot" },
  vs: { en: "vs", fi: "vertailu" },
  sitemap: { en: "sitemap", fi: "sivukartta" },
  privacy: { en: "privacy", fi: "tietosuoja" },
  terms: { en: "terms", fi: "ehdot" },
  pricing: { en: "pricing", fi: "hinnasto" },
  login: { en: "login", fi: "kirjaudu" },
  "sign-up": { en: "sign-up", fi: "liity" },
} as const;

export function withLocalePrefix(locale: Locale, path = "/"): string {
  const normalized =
    path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  if (locale === routing.defaultLocale) return normalized;
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

export function localizedPath(
  locale: Locale,
  key: keyof typeof localizedPrefixes,
  slug?: string
): string {
  const prefix = localizedPrefixes[key][locale];
  const path = slug ? `/${prefix}/${slug}` : `/${prefix}`;
  return withLocalePrefix(locale, path);
}
