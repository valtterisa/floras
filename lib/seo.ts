export const siteConfig = {
  name: "Floras",
  tagline: "A website from one sentence",
  description:
    "Describe your business in plain English. Floras builds a real website you can preview, tweak in chat, and share — no coding or design skills needed.",
  keywords: [
    "AI website builder",
    "create a website",
    "website from a description",
    "no-code website",
    "small business website",
    "Floras",
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

  return "https://floras.ai";
}

export const noIndexRobots = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
} as const;
