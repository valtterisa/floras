import type { SitePlan } from "@/lib/schema/site";

export interface ScaffoldFile {
  path: string;
  content: string;
}

const PREVIEW_PORT = 4321;

export function getPreviewPort() {
  return PREVIEW_PORT;
}

function json(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function packageJson(plan: SitePlan): string {
  return json({
    name: slug(plan.siteName) || "astro-site",
    type: "module",
    version: "0.1.0",
    scripts: {
      dev: `astro dev --host 0.0.0.0 --port ${PREVIEW_PORT}`,
      build: "astro build",
      preview: "astro preview",
    },
    dependencies: {
      astro: "^5.0.0",
      "@tailwindcss/vite": "^4.0.0",
      tailwindcss: "^4.0.0",
    },
  });
}

function astroConfig(): string {
  return `import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: { host: true, port: ${PREVIEW_PORT} },
  vite: {
    plugins: [tailwindcss()],
    server: { allowedHosts: true, cors: true },
  },
});
`;
}

function tsconfig(): string {
  return json({ extends: "astro/tsconfigs/strict" });
}

function globalCss(plan: SitePlan): string {
  const dark = plan.theme === "dark";
  const font = plan.fontFamily || "Inter";
  return `@import "tailwindcss";

:root {
  --accent: ${plan.accentColor};
  --font-sans: "${font}", ui-sans-serif, system-ui, -apple-system, sans-serif;
}

html {
  font-family: var(--font-sans);
  scroll-behavior: smooth;
  background-color: ${dark ? "#0a0a0a" : "#ffffff"};
  color: ${dark ? "#fafafa" : "#0a0a0a"};
}

* { border-color: ${dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}; }

.accent-text { color: var(--accent); }
.accent-bg { background-color: var(--accent); }
.accent-border { border-color: var(--accent); }

@media (prefers-reduced-motion: no-preference) {
  .reveal { animation: reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
  @keyframes reveal {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
}
`;
}

function siteData(plan: SitePlan): string {
  return `export const site = ${json(plan)} as const;
export type Site = typeof site;
`;
}

function fontLink(plan: SitePlan): string {
  const family = (plan.fontFamily || "Inter").replace(/\s+/g, "+");
  return `<link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700;800&display=swap" rel="stylesheet" />`;
}

function baseLayout(plan: SitePlan): string {
  const dark = plan.theme === "dark";
  const surface = dark ? "bg-neutral-950 text-neutral-50" : "bg-white text-neutral-900";
  const navBg = dark ? "bg-neutral-950/70" : "bg-white/70";
  return `---
import { site } from "../site";
import "../styles/global.css";
interface Props { title?: string; description?: string; }
const { title, description } = Astro.props;
const pageTitle = title ? title + " — " + site.siteName : site.siteName;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{pageTitle}</title>
    <meta name="description" content={description ?? site.description} />
    ${fontLink(plan)}
  </head>
  <body class="${surface} antialiased min-h-[100dvh]">
    <header class="sticky top-0 z-50 ${navBg} backdrop-blur-md border-b">
      <nav class="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <a href="/" class="text-lg font-bold tracking-tight">{site.siteName}</a>
        <div class="hidden md:flex items-center gap-8 text-sm font-medium">
          {site.nav.map((item) => (
            <a href={item.href} class="opacity-70 hover:opacity-100 transition-opacity">{item.label}</a>
          ))}
        </div>
        <a href={site.nav[0]?.href ?? "#"} class="accent-bg text-white text-sm font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity">Get started</a>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer class="border-t mt-24">
      <div class="mx-auto max-w-7xl px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-70">
        <p>&copy; {new Date().getFullYear()} {site.siteName}. All rights reserved.</p>
        <div class="flex gap-6">
          {site.nav.map((item) => (<a href={item.href} class="hover:opacity-100 transition-opacity">{item.label}</a>))}
        </div>
      </div>
    </footer>
  </body>
</html>
`;
}

function sectionComponent(plan: SitePlan): string {
  const dark = plan.theme === "dark";
  const muted = dark ? "text-neutral-400" : "text-neutral-600";
  const cardBg = dark ? "bg-neutral-900" : "bg-neutral-50";
  return `---
interface Item { title?: string; description?: string; icon?: string; }
interface Cta { label: string; href: string; }
interface SectionData {
  type: string;
  heading?: string; subheading?: string; body?: string; eyebrow?: string;
  primaryCta?: Cta; secondaryCta?: Cta; items?: Item[]; imagePrompt?: string;
}
const { section } = Astro.props as { section: SectionData };
const seed = encodeURIComponent(section.imagePrompt ?? section.heading ?? "site");
---
{section.type === "hero" && (
  <section class="mx-auto max-w-7xl px-6 pt-20 pb-16 grid lg:grid-cols-2 gap-12 items-center min-h-[80dvh]">
    <div class="reveal">
      {section.eyebrow && <p class="text-sm font-semibold uppercase tracking-widest accent-text mb-4">{section.eyebrow}</p>}
      <h1 class="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">{section.heading}</h1>
      {section.subheading && <p class="mt-6 text-lg ${muted} max-w-xl">{section.subheading}</p>}
      <div class="mt-8 flex flex-wrap gap-4">
        {section.primaryCta && <a href={section.primaryCta.href} class="accent-bg text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-all active:scale-[0.98]">{section.primaryCta.label}</a>}
        {section.secondaryCta && <a href={section.secondaryCta.href} class="font-semibold px-6 py-3 rounded-full border hover:bg-black/5 transition-colors">{section.secondaryCta.label}</a>}
      </div>
    </div>
    <div class="reveal aspect-[4/3] rounded-2xl overflow-hidden border">
      <img src={"https://picsum.photos/seed/" + seed + "/900/700"} alt={section.heading} class="w-full h-full object-cover" />
    </div>
  </section>
)}
{(section.type === "features" || section.type === "bento") && (
  <section class="mx-auto max-w-7xl px-6 py-20">
    {section.eyebrow && <p class="text-sm font-semibold uppercase tracking-widest accent-text mb-3">{section.eyebrow}</p>}
    {section.heading && <h2 class="text-3xl md:text-4xl font-bold tracking-tight max-w-2xl">{section.heading}</h2>}
    {section.subheading && <p class="mt-4 text-lg ${muted} max-w-2xl">{section.subheading}</p>}
    <div class="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {(section.items ?? []).map((item) => (
        <div class="${cardBg} rounded-2xl p-6 border">
          <h3 class="font-semibold text-lg">{item.title}</h3>
          <p class="mt-2 ${muted} text-sm leading-relaxed">{item.description}</p>
        </div>
      ))}
    </div>
  </section>
)}
{section.type === "content" && (
  <section class="mx-auto max-w-3xl px-6 py-20">
    {section.heading && <h2 class="text-3xl md:text-4xl font-bold tracking-tight">{section.heading}</h2>}
    {section.body && <div class="mt-6 text-lg ${muted} leading-relaxed whitespace-pre-line">{section.body}</div>}
  </section>
)}
{(section.type === "testimonials" || section.type === "logos" || section.type === "gallery" || section.type === "faq" || section.type === "pricing") && (
  <section class="mx-auto max-w-7xl px-6 py-20">
    {section.heading && <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-center">{section.heading}</h2>}
    {section.subheading && <p class="mt-4 text-lg ${muted} max-w-2xl mx-auto text-center">{section.subheading}</p>}
    <div class="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {(section.items ?? []).map((item) => (
        <div class="${cardBg} rounded-2xl p-6 border">
          <h3 class="font-semibold">{item.title}</h3>
          <p class="mt-2 ${muted} text-sm leading-relaxed">{item.description}</p>
        </div>
      ))}
    </div>
  </section>
)}
{section.type === "cta" && (
  <section class="mx-auto max-w-5xl px-6 py-24">
    <div class="accent-bg rounded-3xl px-8 py-16 text-center text-white">
      <h2 class="text-3xl md:text-5xl font-bold tracking-tight">{section.heading}</h2>
      {section.subheading && <p class="mt-4 text-lg opacity-90 max-w-2xl mx-auto">{section.subheading}</p>}
      {section.primaryCta && <a href={section.primaryCta.href} class="inline-block mt-8 bg-white text-neutral-900 font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity">{section.primaryCta.label}</a>}
    </div>
  </section>
)}
{section.type === "blogList" && (
  <section class="mx-auto max-w-7xl px-6 py-20">
    {section.heading && <h2 class="text-3xl md:text-4xl font-bold tracking-tight">{section.heading}</h2>}
    <p class="mt-4 ${muted}">Visit the <a href="/blog" class="accent-text font-semibold underline">blog</a> for the latest posts.</p>
  </section>
)}
`;
}

function pageFile(plan: SitePlan, page: SitePlan["pages"][number]): string {
  return `---
import BaseLayout from "../layouts/BaseLayout.astro";
import Section from "../components/Section.astro";
import { site } from "../site";
const page = site.pages.find((p) => p.path === ${JSON.stringify(page.path)})!;
---
<BaseLayout title={page.title} description={page.description}>
  {page.sections.map((section) => (<Section section={section} />))}
</BaseLayout>
`;
}

function pagePath(routePath: string): string {
  if (routePath === "/" || routePath === "") return "src/pages/index.astro";
  const clean = routePath.replace(/^\/+|\/+$/g, "");
  return `src/pages/${clean}.astro`;
}

function blogFiles(plan: SitePlan): ScaffoldFile[] {
  if (!plan.blog?.enabled) return [];
  const dark = plan.theme === "dark";
  const muted = dark ? "text-neutral-400" : "text-neutral-600";
  const files: ScaffoldFile[] = [];

  files.push({
    path: "src/content.config.ts",
    content: `import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
`,
  });

  for (const post of plan.blog.posts) {
    files.push({
      path: `src/content/blog/${post.slug}.md`,
      content: `---
title: ${JSON.stringify(post.title)}
description: ${JSON.stringify(post.description)}
date: ${JSON.stringify(post.date)}
tags: ${JSON.stringify(post.tags)}
---

${post.body}
`,
    });
  }

  files.push({
    path: "src/pages/blog/index.astro",
    content: `---
import BaseLayout from "../../layouts/BaseLayout.astro";
import { getCollection } from "astro:content";
const posts = (await getCollection("blog")).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---
<BaseLayout title="Blog">
  <section class="mx-auto max-w-3xl px-6 py-20">
    <h1 class="text-4xl md:text-5xl font-bold tracking-tight">Blog</h1>
    <div class="mt-12 divide-y">
      {posts.map((post) => (
        <a href={"/blog/" + post.id} class="block py-6 group">
          <p class="text-sm ${muted}">{post.data.date.toLocaleDateString()}</p>
          <h2 class="mt-1 text-xl font-semibold group-hover:accent-text transition-colors">{post.data.title}</h2>
          <p class="mt-2 ${muted}">{post.data.description}</p>
        </a>
      ))}
    </div>
  </section>
</BaseLayout>
`,
  });

  files.push({
    path: "src/pages/blog/[...slug].astro",
    content: `---
import BaseLayout from "../../layouts/BaseLayout.astro";
import { getCollection, render } from "astro:content";
export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}
const { post } = Astro.props;
const { Content } = await render(post);
---
<BaseLayout title={post.data.title} description={post.data.description}>
  <article class="mx-auto max-w-2xl px-6 py-20 prose">
    <p class="text-sm ${muted}">{post.data.date.toLocaleDateString()}</p>
    <h1 class="text-4xl font-bold tracking-tight mt-2">{post.data.title}</h1>
    <div class="mt-8 leading-relaxed ${muted}">
      <Content />
    </div>
  </article>
</BaseLayout>
`,
  });

  return files;
}

/**
 * Deterministically turn a validated SitePlan into a complete Astro project.
 * This is the "output schema instead of wild parsing" core: the model returns
 * structured data, and we generate guaranteed-valid source files from it.
 */
export function scaffoldAstroProject(plan: SitePlan): ScaffoldFile[] {
  const files: ScaffoldFile[] = [
    { path: "package.json", content: packageJson(plan) },
    { path: "astro.config.mjs", content: astroConfig() },
    { path: "tsconfig.json", content: tsconfig() },
    { path: "src/styles/global.css", content: globalCss(plan) },
    { path: "src/site.ts", content: siteData(plan) },
    { path: "src/layouts/BaseLayout.astro", content: baseLayout(plan) },
    { path: "src/components/Section.astro", content: sectionComponent(plan) },
  ];

  for (const page of plan.pages) {
    files.push({ path: pagePath(page.path), content: pageFile(plan, page) });
  }

  files.push(...blogFiles(plan));
  return files;
}

function slug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
