import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";
import { routing } from "@/i18n/routing";
import { USE_CASES } from "@/lib/pseo/use-cases";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticPaths = ["", "/login", "/sign-up", "/privacy", "/terms"];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.4,
      });
    }

    for (const useCase of USE_CASES) {
      entries.push({
        url: `${base}/${locale}/for/${useCase.slugs[locale]}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
