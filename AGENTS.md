# Floras — AI Astro site generator

Floras turns a plain-English prompt into a production-ready Astro site with a live
preview. It is a Next.js 16 (App Router) frontend backed by Convex, generating
sites inside Blaxel sandboxes via an AI SDK agent, with Autumn billing.

## Architecture

- **Frontend:** Next.js App Router + Tailwind v4 (dark, locked theme). Chat UI is
  built with AI SDK Elements (`components/ai-elements/*`). Marketing/app UI is
  composition-first: pages use `MarketingLayout` / `DashboardShell`, shared shells in
  `components/site/*` (`PageHeader`, `Section`, `EmptyState`, `Container`), and
  feature modules in `landing/`, `dashboard/`, `workspace/`, `auth/`. Billing gates
  around composers share `useBillingGates` / `BillingGateModals`.
- **Backend/DB:** Convex (`convex/`). Auth via Convex Auth (Password + Google
  OAuth). Reactive queries drive the chat + preview. Mutations use `authedMutation`
  (`convex/lib/customFunctions.ts`) so only signed-in owners can write.
- **Agent:** AI SDK 7 `ToolLoopAgent` (`lib/ai/agent.ts`) runs from Next.js API
  routes (`app/api/generate`, `lib/generate/run-generation.ts`). Tool activity +
  summaries stream back into Convex tables, so the UI updates reactively.
  Pro uses the platform Anthropic key + Autumn metering; BYOK uses the user's
  encrypted Anthropic key (no Autumn credit metering).
- **Template:** New sandboxes boot from `BL_SANDBOX_IMAGE` (default
  `blaxel/node:latest`), then shallow-clone `BL_TEMPLATE_REPO` (optional
  `BL_TEMPLATE_REF`, default `main`) into `/app` when the site root is empty.
  Private repos: set `BL_TEMPLATE_GITHUB_TOKEN`. The agent stores a zod `SitePlan`
  (`lib/schema/site.ts`) then edits the site in place.
- **Sandbox/preview:** `lib/sandbox/client.ts` wraps `@blaxel/core`. Each project gets
  a named Blaxel sandbox (`floras-{projectId}`) running the Astro (or bun/pnpm) dev
  server on port 4321, exposed via Blaxel preview URLs (`*.preview.bl.run`).
  Preview URLs are public (`public: true`) so anyone with the URL can view the draft
  site — treat leaked URLs as confidentiality loss; do not put secrets in generated
  sites. Convex stores `sandboxName` on the project (must match `floras-{projectId}`;
  `setSandbox` and API entrypoints reject foreign names). Site files are snapshotted to
  Cloudflare R2 via `@convex-dev/r2` (`sites/{projectId}/workspace.tar.gz`, field
  `snapshotKey`) after generation and on preview stop; recreate restores from R2 before
  cloning the template. No Blaxel volumes (free-tier incompatible).
- **Publish / domains:** Next.js routes `app/api/publish` and `app/api/domains`. Sandbox
  builds the site; Next.js pulls `dist` and runs Wrangler Direct Upload locally so
  `CLOUDFLARE_*` never enters the VM. Pages/DNS CRUD uses the `cloudflare` SDK. Publish
  also upserts `{id}.floras.app` → `*.pages.dev`. **Pro only** — BYOK is export-only.
- **Billing:** `autumn-js` via Next.js (`app/api/autumn/[...all]`, `lib/billing/get-access.ts`,
  fail-closed in production; fail-open only when `BILLING_FAIL_OPEN=1` or non-prod) + `autumn.config.ts` plans.
  Plans: **BYOK** ($5/mo, user Anthropic key, preview + export) and **Pro** (credits + hosting).
  Frontend uses `autumn-js/react`.

## Cursor Cloud specific instructions

- **Two dev processes.** Run Convex and Next.js together during development:
  `pnpm dev:convex` (starts `convex dev`, generates `convex/_generated`, pushes
  functions) and `pnpm dev` (Next.js on :3000). Standard scripts live in `package.json`.
- **Convex is required for the app to function.** `NEXT_PUBLIC_CONVEX_URL` and
  `CONVEX_DEPLOYMENT` are written to `.env.local` by `convex dev`. Without a running
  deployment, client queries stay in a loading state.
- **Keep heavy SDKs out of Convex.** AI SDK, Blaxel SDK, and `autumn-js` run in
  Next.js API routes — not Convex actions — so pushes stay under the 64MB
  module-load limit. Do not reintroduce those packages into `convex/`.
- **Secrets for generation/sandbox/billing/CF live in Next.js `.env.local`:**
  `ANTHROPIC_API_KEY`, `BYOK_ENCRYPTION_SECRET`, `BL_API_KEY`, `BL_WORKSPACE`,
  `BL_TEMPLATE_REPO`, `AUTUMN_SECRET_KEY`, Cloudflare publish vars below. Optional:
  `AGENT_MODEL` (defaults to `claude-sonnet-5`), `BL_TEMPLATE_REF` (default `main`),
  `BL_TEMPLATE_GITHUB_TOKEN`, `BL_SANDBOX_IMAGE` (default `blaxel/node:latest`),
  `BL_SANDBOX_REGION` (default `eu-lon-1`), `BL_SANDBOX_MEMORY_MB`, `BL_SANDBOX_IDLE_TTL` (default `60d`;
  set `off` to disable), `BL_SITE_ROOT` (defaults to `/app`), `BL_PREVIEW_PORT`
  (defaults to `4321`). Site persistence uses Cloudflare R2 through the Convex
  `@convex-dev/r2` component (not Blaxel volumes). Set on the **Convex** deployment:
  `R2_BUCKET` (`floras-sites`), `R2_ENDPOINT`
  (`https://<ACCOUNT_ID>.r2.cloudflarestorage.com`), `R2_ACCESS_KEY_ID`,
  `R2_SECRET_ACCESS_KEY`, and optionally `R2_TOKEN`. Bucket CORS must allow GET/PUT
  from your app origins. Template repo is cloned into the sandbox only when empty
  and no R2 snapshot exists.
- **Cloudflare publish (Next.js `.env.local` / host secrets, not sandbox env):**
  `CLOUDFLARE_API_TOKEN` (User token: Account → Cloudflare Pages → Edit **and**
  Zone → DNS → Edit on `floras.app`), `CLOUDFLARE_ACCOUNT_ID`, and
  `CLOUDFLARE_ZONE_ID` (floras.app zone). Pages does not support wildcard custom
  domains, so publish upserts a per-site CNAME `{id}.floras.app` → `*.pages.dev`.
  Do **not** put these in sandbox env — publish uploads from the Next.js process only.
- **Cloudflare Email Sending (form notifications, Next.js only):** Onboard
  `floras.app` under Dashboard → Compute → Email Service → Email Sending (Workers
  Paid). Token needs Account → Email Sending → Edit (`CLOUDFLARE_API_TOKEN` or
  `CLOUDFLARE_EMAIL_API_TOKEN`). Set `EMAIL_FROM` (e.g. `Floras <noreply@floras.app>`).
  Client: `lib/email/send.ts` → REST `POST .../email/sending/send`. Never inject
  email credentials into sandboxes.
- **Convex deployment env** (set with `npx convex env set`): Convex Auth keys via
  `npx @convex-dev/auth` (`JWT_PRIVATE_KEY`, `JWKS`, `SITE_URL`), plus Google OAuth
  `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`. Redirect URI:
  `{CONVEX_SITE_URL}/api/auth/callback/google`. Not the Anthropic/Blaxel/CF keys.
- **Autumn pricing:** push plans with `npx atmn push` (config in `autumn.config.ts`).
  Includes `byok` ($5/mo), `pro`, `pro_yearly`, and `credit_top_up`.
- **Preview iframes** load Blaxel preview URLs (`*.preview.bl.run`); those URLs are
  world-readable if leaked. The cloned Astro template must set
  `server.allowedHosts: true` and bind `0.0.0.0` (or `HOST=0.0.0.0`) so those hosts
  are not blocked. Declare port `4321` at sandbox creation (ports cannot be added
  later).
- **Typecheck:** `pnpm typecheck` / `next build` both enforce TypeScript. Auth gating
  lives in `proxy.ts` (Next.js 16 network proxy).
- **Busy jobs:** generate/publish use atomic `claimGeneration` / `claimPublish`. Stuck
  busy states auto-reclaim after 15 minutes via `busyAt`, or the owner can call
  `projects.resetBusy`.
