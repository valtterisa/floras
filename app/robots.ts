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
          "/account",
          "/build/",
          "/login",
          "/sign-up",
          "/signin",
          "/en/dashboard",
          "/fi/dashboard",
          "/en/account",
          "/fi/account",
          "/en/build/",
          "/fi/build/",
          localizedPath("en", "login"),
          localizedPath("fi", "login"),
          localizedPath("en", "sign-up"),
          localizedPath("fi", "sign-up"),
          "/en/signin",
          "/fi/signin",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
