# Floras

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Convex](https://img.shields.io/badge/Backend-Convex-orange)](https://convex.dev/)

**Floras** turns a plain-English prompt into a production-ready [Astro](https://astro.build/) site with a live preview.

It is a Next.js 16 (App Router) frontend backed by [Convex](https://www.convex.dev/), generating sites inside [Blaxel](https://blaxel.ai) sandboxes via an [AI SDK](https://ai-sdk.dev/) agent, with [Autumn](https://useautumn.com/) billing.

## Features

- **Prompt → Astro site** — Describe the site; an agent plans and scaffolds a full Astro project
- **Live sandbox preview** — Each project runs `astro dev` in a Blaxel sandbox on a public preview URL
- **Structured output** — Zod `SitePlan` drives a deterministic scaffolder (no brittle parsing of model text)
- **Reactive chat UI** — Tool activity and summaries stream into Convex; the UI updates live
- **Auth + billing** — Convex Auth (password) and Autumn usage gating

## Table of contents

- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Environment variables](#environment-variables)
- [Development notes](#development-notes)
- [Project structure](#project-structure)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## Tech stack

| Layer | Stack |
| --- | --- |
| Frontend | Next.js 16 App Router, Tailwind v4, AI SDK Elements |
| Backend / DB | Convex + Convex Auth (password) |
| Agent | AI SDK 7 `ToolLoopAgent` in a Convex Node action |
| Output | Zod `SitePlan` → deterministic Astro scaffold |
| Preview | Blaxel sandboxes running `astro`/`bun`/`pnpm` dev |
| Billing | Autumn (`@useautumn/convex` + `autumn-js`) |

## Architecture

```text
Prompt → Next.js generate API → AI agent (plan + tools)
                ↓                        ↓
         SitePlan (zod)          Blaxel sandbox (astro/bun/pnpm dev)
                ↓                        ↓
      edit /app in place         public preview URL
                ↓                        ↓
         Convex tables  ←── reactive UI (chat + iframe)
```

- **Frontend:** Chat UI via `components/ai-elements/*`. Pages compose `MarketingLayout` / `DashboardShell` with feature modules in `landing/`, `dashboard/`, `workspace/`, and shared shells in `site/`.
- **Backend:** Convex (`convex/`). Reactive queries drive chat + preview.
- **Agent:** `lib/ai/agent.ts` runs from Next.js (`lib/generate/run-generation.ts`). Tool activity and summaries stream into Convex tables.
- **Output schema:** `lib/schema/site.ts` — agent edits the Astro site in the sandbox.
- **Sandbox:** `lib/sandbox/client.ts` wraps `@blaxel/core`. Preview URLs use `*.preview.bl.run`.
- **Billing:** Autumn via Next.js (`app/api/autumn/[...all]`) + plans in `autumn.config.ts`. Frontend via `autumn-js/react`.

Agent-oriented notes for Cursor / coding agents live in [`AGENTS.md`](AGENTS.md).

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) 10+
- A [Convex](https://www.convex.dev/) account (cloud deployment recommended for generation)
- API keys for Anthropic, Blaxel, and Autumn (see [`.env.example`](.env.example))

## Quickstart

### 1. Clone and install

```bash
git clone https://github.com/valtterisa/builddrr-app.git
cd builddrr-app
pnpm install
```

### 2. Environment

```bash
cp .env.example .env.local
```

Start Convex (writes `NEXT_PUBLIC_CONVEX_URL` and `CONVEX_DEPLOYMENT` into `.env.local`):

```bash
pnpm dev:convex
```

In another terminal, set Convex Auth secrets (AI/Blaxel/Autumn stay in Next.js `.env.local`):

```bash
npx @convex-dev/auth
```

Also put Blaxel + Autumn keys in `.env.local`:

```bash
# .env.local
BL_API_KEY=...
BL_WORKSPACE=...
BL_SANDBOX_IMAGE=...   # deployed Astro template image
AUTUMN_SECRET_KEY=...
ANTHROPIC_API_KEY=...
```

Push Autumn plans (optional for local billing UI):

```bash
npx atmn push
```

### 3. Run

Keep Convex running, then:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Without a running Convex deployment, client queries stay in a loading state.

## Environment variables

Full reference: [`.env.example`](.env.example).

**Next.js (`.env.local`)**

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CONVEX_URL` | Convex client URL (from `convex dev`) |
| `CONVEX_DEPLOYMENT` | Deployment name (from `convex dev`) |
| `AUTUMN_SECRET_KEY` | Autumn handler on the Next.js side |
| `ANTHROPIC_API_KEY` | Platform Anthropic key (Pro generation) |
| `BL_API_KEY` | Blaxel API key |
| `BL_WORKSPACE` | Blaxel workspace |
| `BL_SANDBOX_IMAGE` | Deployed Astro sandbox template image |
| `CLOUDFLARE_API_TOKEN` | Pages Edit + Zone DNS Edit (floras.app) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account for Pages projects |
| `CLOUDFLARE_ZONE_ID` | floras.app zone ID (per-subdomain CNAMEs) |
| `FLORAS_SITES_DOMAIN` | Public host suffix (default `floras.app`) |

**Convex deployment** (`npx convex env set …`)

| Variable | Required | Purpose |
| --- | --- | --- |
| `JWT_PRIVATE_KEY` / `JWKS` / `SITE_URL` | yes | Via `npx @convex-dev/auth` |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | no | Google OAuth |

## Development notes

- **Heavy SDKs:** AI SDK + Blaxel + Autumn run in Next.js API routes — keep them out of Convex.
- **Preview hosts:** Sandbox Astro servers load over Blaxel `*.preview.bl.run`; templates must allow those hosts and bind `0.0.0.0`.
- **Typecheck:** Use `pnpm typecheck` for real checking. Auth gating is in `proxy.ts`.

## Project structure

| Path | Role |
| --- | --- |
| `app/` | Next.js App Router (marketing, auth, workspace, Autumn API) |
| `components/ai-elements/` | Chat UI primitives |
| `components/site/` | Layouts, PageHeader, Section, EmptyState, Container, nav/footer |
| `components/landing/` | Landing sections |
| `components/dashboard/` | Dashboard prompt + project grid/cards |
| `components/workspace/` | Workspace header, chat, preview |
| `components/auth/` | Sign-in form + auth modal |
| `convex/` | Schema, auth, generate action, Autumn, projects/messages |
| `lib/ai/` | Agent + design guidelines |
| `lib/schema/` | Zod `SitePlan` |
| `lib/astro/` | Deterministic Astro scaffolder |
| `lib/sandbox/` | Blaxel sandbox client (`@blaxel/core`) |
| `autumn.config.ts` | Autumn plans |

## Scripts

```bash
pnpm dev          # Next.js (Turbopack) on :3000
pnpm dev:convex   # Convex backend
pnpm build        # Production build
pnpm typecheck    # tsc --noEmit
```

## Contributing

Contributions are welcome. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for setup, branch workflow, and PR expectations. Please also read the [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## Security

Do not open public issues for vulnerabilities. See [`SECURITY.md`](SECURITY.md).

## License

MIT — see [`LICENSE`](LICENSE).
