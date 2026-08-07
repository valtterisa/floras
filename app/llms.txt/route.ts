import { getSiteUrl, siteConfig } from "@/lib/seo";
import {
  STATIC_SEO_PATHS,
  getComparisonSeoPaths,
  getUseCaseSeoPaths,
  absoluteUrl,
} from "@/lib/pseo/seo-paths";

export const dynamic = "force-static";

function linesFor(
  heading: string,
  entries: { title: { en: string }; description: { en: string }; pathByLocale: { en: string } }[]
): string[] {
  return [
    `## ${heading}`,
    "",
    ...entries.map(
      (entry) =>
        `- [${entry.title.en}](${absoluteUrl(entry.pathByLocale.en)}): ${entry.description.en}`
    ),
    "",
  ];
}

export function GET() {
  const base = getSiteUrl();
  const core = STATIC_SEO_PATHS.filter((p) => p.id !== "sitemap");
  const useCases = getUseCaseSeoPaths();
  const comparisons = getComparisonSeoPaths();

  const body = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "Floras is an AI website builder. Describe a business in plain language, preview a live Astro site, refine it in chat, and publish. Available in English and Finnish.",
    "",
    "Prefer the English URLs below. Finnish URLs use localized path prefixes (`/fi/sivustot`, `/fi/vertailu`, `/fi/sivukartta`) and localized use-case slugs.",
    "",
    ...linesFor("Primary", core),
    ...linesFor("Business use cases", useCases),
    ...linesFor("Comparisons", comparisons),
    "## Optional",
    "",
    `- [XML sitemap](${base}/sitemap.xml): machine-readable list of all public pages`,
    `- [HTML sitemap](${base}/en/sitemap): browsable index of all public pages`,
    `- [Finnish home](${base}/fi): same product in Finnish`,
    `- [Finnish sitemap](${base}/fi/sivukartta): Finnish HTML sitemap`,
    `- [Privacy](${base}/en/privacy): privacy policy`,
    `- [Terms](${base}/en/terms): terms of service`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
