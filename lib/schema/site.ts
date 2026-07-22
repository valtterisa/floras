import { z } from "zod";

export const navItemSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const featureItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
});

export const sectionSchema = z.object({
  type: z.enum([
    "hero",
    "features",
    "bento",
    "logos",
    "testimonials",
    "pricing",
    "faq",
    "cta",
    "gallery",
    "content",
    "blogList",
  ]),
  heading: z.string().optional(),
  subheading: z.string().optional(),
  body: z.string().optional(),
  eyebrow: z.string().optional(),
  primaryCta: z.object({ label: z.string(), href: z.string() }).optional(),
  secondaryCta: z.object({ label: z.string(), href: z.string() }).optional(),
  items: z.array(featureItemSchema).optional(),
  imagePrompt: z.string().optional(),
});

export const pageSchema = z.object({
  path: z.string().describe('Route path, e.g. "/" or "/about"'),
  title: z.string(),
  description: z.string().optional(),
  sections: z.array(sectionSchema),
});

export const blogPostSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  date: z.string().describe("ISO date, e.g. 2026-01-15"),
  tags: z.array(z.string()).default([]),
  body: z.string().describe("Markdown body of the post"),
});

export const sitePlanSchema = z.object({
  siteName: z.string(),
  tagline: z.string(),
  description: z.string(),
  accentColor: z
    .string()
    .describe("Single accent color as a hex value, e.g. #2563eb")
    .default("#111827"),
  theme: z.enum(["light", "dark"]).default("light"),
  fontFamily: z
    .string()
    .describe("Google font family name. Prefer Geist, Outfit, Satoshi, Plus Jakarta Sans. Avoid Inter.")
    .default("Geist"),
  nav: z.array(navItemSchema).default([]),
  pages: z.array(pageSchema).min(1),
  blog: z
    .object({
      enabled: z.boolean().default(false),
      posts: z.array(blogPostSchema).default([]),
    })
    .default({ enabled: false, posts: [] }),
});

export type NavItem = z.infer<typeof navItemSchema>;
export type FeatureItem = z.infer<typeof featureItemSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type Page = z.infer<typeof pageSchema>;
export type BlogPost = z.infer<typeof blogPostSchema>;
export type SitePlan = z.infer<typeof sitePlanSchema>;
