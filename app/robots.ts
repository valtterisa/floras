import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";
import { localizedPath } from "@/i18n/routing";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/llms.txt", "/sitemap.xml"],
        disallow: [
          "/api/",
          "/auth/",
          "/dashboard",
          "/fi/dashboard",
          "/account",
          "/fi/account",
          "/build/",
          "/fi/build/",
          localizedPath("en", "login"),
          localizedPath("fi", "login"),
          localizedPath("en", "sign-up"),
          localizedPath("fi", "sign-up"),
          "/signin",
          "/fi/signin",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
