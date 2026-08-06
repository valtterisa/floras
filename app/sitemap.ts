import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import {
  getAllSeoPaths,
  absoluteUrl,
  languageAlternates,
} from "@/lib/pseo/seo-paths";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of getAllSeoPaths()) {
    const languages = languageAlternates(path.pathByLocale);
    for (const locale of routing.locales) {
      entries.push({
        url: absoluteUrl(path.pathByLocale[locale]),
        lastModified: now,
        changeFrequency: path.changeFrequency,
        priority: path.priority,
        alternates: { languages },
      });
    }
  }

  return entries;
}
