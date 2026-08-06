import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

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
          "/en/login",
          "/fi/login",
          "/en/sign-up",
          "/fi/sign-up",
          "/en/signin",
          "/fi/signin",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
