export const siteConfig = {
  name: "Builddrr",
  tagline: "Astro sites from one sentence",
  description:
    "Describe your idea. Builddrr generates a production-ready Astro site with a live preview in seconds — refine in chat and ship with confidence.",
  keywords: [
    "Astro",
    "AI website builder",
    "generate Astro site",
    "AI web design",
    "site generator",
    "Builddrr",
  ],
  ogImage: "/og-image.png",
} as const;

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (explicit) return explicit;

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/\/$/, "");
  if (vercel) return `https://${vercel}`;

  const vercelUrl = process.env.VERCEL_URL?.replace(/\/$/, "");
  if (vercelUrl) return `https://${vercelUrl}`;

  return "https://app.builddrr.dev";
}

export const noIndexRobots = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
} as const;
