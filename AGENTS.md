# Floras — AI Astro site generator

Floras turns a plain-English prompt into a production-ready Astro site with a live
preview. It is a Next.js 16 (App Router) frontend backed by Convex, generating
sites inside box.ascii.dev sandboxes via an AI SDK agent, with Autumn billing.

## Architecture

- **Frontend:** Next.js App Router + Tailwind v4 (dark, locked theme). Chat UI is
  built with AI SDK Elements (`components/ai-elements/*`). Marketing/app UI is
  composition-first: pages use `MarketingLayout` / `AppLayout`, shared shells in
  `components/site/*` (`PageHeader`, `Section`, `EmptyState`, `Container`), and
  feature modules in `landing/`, `dashboard/`, `workspace/`, `auth/`.
- **Backend/DB:** Convex (`convex/`). Auth via Convex Auth (password provider).
  Reactive queries drive the chat + preview.
- **Agent:** AI SDK 7 `ToolLoopAgent` (`lib/ai/agent.ts`) runs from Next.js API
  routes (`app/api/generate`, `lib/generate/run-generation.ts`). Tool activity +
  summaries stream back into Convex tables, so the UI updates reactively.
- **Template:** New Boxes clone `BOX_TEMPLATE_REPO_URL` into `site/`. The agent
  stores a zod `SitePlan` (`lib/schema/site.ts`) then edits the template in place.
- **Sandbox/preview:** `lib/box/client.ts` wraps `@asciidev/box-sdk`. Each project
  gets a Box VM running `astro dev` exposed on a public URL via the in-box `host` command.
  User Boxes are created with `noEnv: true`.
- **Publish / domains:** Next.js routes `app/api/publish` and `app/api/domains`. Build +
  Wrangler Direct Upload run **inside** the Box; Pages project/domain CRUD uses the
  official `cloudflare` SDK. Live URL comes from Pages REST GET, not Wrangler stdout.
- **Billing:** `autumn-js` via Next.js (`app/api/autumn/[...all]`, `lib/billing/get-access.ts`,
  fail-open) + `autumn.config.ts` plans. Frontend uses `autumn-js/react`.

## Cursor Cloud specific instructions

- **Two dev processes.** Run Convex and Next.js together during development:
  `pnpm dev:convex` (starts `convex dev`, generates `convex/_generated`, pushes
  functions) and `pnpm dev` (Next.js on :3000). Standard scripts live in `package.json`.
- **Convex is required for the app to function.** `NEXT_PUBLIC_CONVEX_URL` and
  `CONVEX_DEPLOYMENT` are written to `.env.local` by `convex dev`. Without a running
  deployment, client queries stay in a loading state.
- **`convex/_generated` is committed as an untyped `AnyApi` fallback** so the repo
  builds without a deployment. Running `convex dev` against a real deployment
  regenerates fully-typed versions; frontend Convex calls are intentionally
  cast to `any` where the generated types are the stub.
- **Keep heavy SDKs out of Convex.** AI SDK, Box SDK, and `autumn-js` run in
  Next.js API routes — not Convex actions — so pushes stay under the 64MB
  module-load limit. Do not reintroduce those packages into `convex/`.
- **Secrets live in the Convex deployment, not `.env.local`.** Set them with
  `npx convex env set KEY value`: `ANTHROPIC_API_KEY` (Anthropic),
  `BOX_API_KEY` (box.ascii.dev), `AUTUMN_SECRET_KEY` (Autumn). Also put
  `AUTUMN_SECRET_KEY` in `.env.local` for the Next.js Autumn handler. Optional:
  `AGENT_MODEL` (defaults to `claude-sonnet-4-5`), `BOX_BASE_URL`.
  Next.js also needs `BOX_TEMPLATE_REPO_URL` (public Astro template git URL).
- **Cloudflare publish (Next.js `.env.local` / host secrets, not Box dashboard):**
  `CLOUDFLARE_API_TOKEN` (Account → Cloudflare Pages → Edit) and
  `CLOUDFLARE_ACCOUNT_ID`. Do **not** put these in Box Dashboard → Secrets — user
  Boxes are `noEnv` and must not receive Floras hosting credentials. Publish injects
  them into the Box only for the Wrangler deploy command, then scrubs the temp file.
- **Convex Auth keys:** run `npx @convex-dev/auth` once to provision `JWT_PRIVATE_KEY`,
  `JWKS`, and `SITE_URL` in the Convex deployment env.
- **Autumn pricing:** push plans with `npx atmn push` (config in `autumn.config.ts`).
- **Preview iframes** load the sandbox Astro dev server over `*.on.ascii.dev`; the
  template should set Vite `server.allowedHosts: true` so those hosts are not blocked.
- `next build` ignores type errors (see `next.config.mjs`); run `pnpm typecheck`
  for real type checking. Auth gating lives in `proxy.ts` (Next.js 16 network proxy).
