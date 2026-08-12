# Floras — architecture illustrations

Copy any diagram block into your markdown post. Renders on GitHub, GitLab, Notion (mermaid block), and most static site generators with Mermaid enabled.

---

## 1. System overview

Three planes: **Floras app** (you control), **sandboxes** (agent edits here), **published sites** (static output).

```mermaid
flowchart TB
  subgraph App["Floras app (Vercel + Convex)"]
    UI[Next.js UI<br/>chat · dashboard · workspace]
    API[Next.js API routes<br/>generate · publish · forms]
    DB[(Convex<br/>projects · messages · submissions)]
    UI <-->|reactive queries| DB
    UI --> API
  end

  subgraph Sandbox["Blaxel microVM (per project)"]
    Astro[Astro dev/build<br/>floras-projectId]
    Preview[Preview URL<br/>*.preview.bl.run]
    Astro --> Preview
  end

  subgraph Storage["Cloudflare"]
    R2[(R2<br/>workspace.tar.gz)]
    Pages[Pages<br/>id.floras.app]
  end

  User((User)) --> UI
  API -->|AI SDK agent + tools| Astro
  API -->|stream dist · Wrangler| Pages
  Astro -->|snapshot on stop| R2
  R2 -->|restore on wake| Astro
  Preview --> UI
  Pages --> Visitor((Site visitor))
  Visitor -->|contact form POST| API
```

---

## 2. Stack layers

What runs where — and what deliberately does **not** live in Convex.

```mermaid
flowchart LR
  subgraph Client
    Browser[Browser]
  end

  subgraph Vercel["Vercel (Next.js 16)"]
    PagesUI[App Router UI]
    Routes[API routes]
    Agent[AI SDK ToolLoopAgent]
    Wrangler[Wrangler CLI]
    Autumn[autumn-js billing]
  end

  subgraph ConvexCloud["Convex"]
    Auth[Convex Auth]
    Tables[DB + reactive queries]
    R2Comp["@convex-dev/r2"]
  end

  subgraph External
    Blaxel[Blaxel sandboxes]
    Anthropic[Anthropic API]
    CF[Cloudflare R2 + Pages + DNS]
  end

  Browser --> PagesUI
  Browser --> Routes
  PagesUI <--> Tables
  Routes --> Agent
  Routes --> Wrangler
  Routes --> Autumn
  Routes --> Blaxel
  Agent --> Anthropic
  Agent --> Blaxel
  Routes --> Tables
  R2Comp --> CF
  Wrangler --> CF
```

---

## 3. Generation flow (chat → live preview)

The streaming assistant row from `messages.send` is the turn lock — no separate claim job.

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant UI as Workspace UI
  participant Convex
  participant API as POST /api/generate
  participant Agent as AI SDK agent
  participant VM as Blaxel sandbox

  User->>UI: Prompt (Build mode)
  UI->>Convex: messages.send
  Note over Convex: user msg + assistant<br/>status: streaming
  Convex-->>UI: assistantId
  UI->>API: triggerGeneration
  API->>Agent: runGeneration
  Agent->>Convex: setStatus(generating)
  Agent->>Agent: plan_site → SitePlan (Zod)
  Agent->>VM: ensure_sandbox · write_file · run_command
  VM-->>UI: preview iframe (*.preview.bl.run)
  loop tool steps
    Agent->>Convex: messages.addStep
    Convex-->>UI: reactive update
  end
  Agent->>Convex: messages.finish · setStatus(ready)
  Agent->>Convex: snapshot workspace → R2
```

---

## 4. Agent tool loop (inside the sandbox)

```mermaid
flowchart TD
  Start([User prompt]) --> Send[messages.send<br/>streaming assistant]
  Send --> Gen[POST /api/generate]
  Gen --> Inspect{inspect_site}
  Inspect -->|new site| Plan[plan_site<br/>Zod SitePlan]
  Inspect -->|existing| Edit[edit in place]
  Plan --> Sandbox[ensure_sandbox]
  Sandbox --> Tools[write_file · read_file · run_command]
  Tools --> Preview[astro dev :4321]
  Preview --> Stream[steps → Convex → UI]
  Stream --> Done([status: ready])
  Edit --> Tools
```

---

## 5. Sandbox persistence (R2 vs volumes)

Blaxel free tier has no volumes. R2 holds **source**, not the published site.

```mermaid
flowchart LR
  subgraph VM["Blaxel sandbox"]
    Src[/app<br/>Astro source/]
    Dev[astro dev]
    Build[astro build]
    Dist[/dist/]
    Src --> Dev
    Src --> Build
    Build --> Dist
  end

  subgraph R2["Cloudflare R2"]
    Tar[workspace.tar.gz<br/>sites/projectId/]
  end

  subgraph Pages["Cloudflare Pages"]
    Static[Static HTML/CSS/JS<br/>id.floras.app]
  end

  Src -->|on stop / after gen| Tar
  Tar -->|on recreate| Src
  Dist -->|publish only<br/>stream tar → Next.js| Static

  style Tar fill:#1a1a2e,stroke:#888,color:#eee
  style Static fill:#1a1a2e,stroke:#888,color:#eee
```

---

## 6. Publish flow (secrets stay out of the VM)

Cloudflare tokens live in Next.js env only. The agent never sees them.

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant API as Next.js /api/publish
  participant Convex
  participant VM as Blaxel sandbox
  participant Tmp as /tmp on Vercel
  participant CF as Cloudflare Pages

  User->>API: Publish (Pro)
  API->>Convex: setPublishStatus(publishing)
  API->>VM: ensureSandboxReady
  API->>VM: astro build
  VM->>VM: tar dist → dist.tar
  VM->>Tmp: stream dist.tar
  Tmp->>Tmp: extract · validate index.html
  Tmp->>CF: wrangler pages deploy
  API->>Convex: setPublished<br/>id.floras.app CNAME
  CF-->>User: live site
```

---

## 7. Trust boundary (what the agent can touch)

```mermaid
flowchart TB
  subgraph Safe["Agent + sandbox CAN access"]
    Template[GitHub template repo]
    SiteFiles[Astro source in /app]
    DevServer[astro dev preview]
  end

  subgraph Host["Next.js host ONLY"]
    CFToken[CLOUDFLARE_API_TOKEN]
    AnthropicKey[ANTHROPIC_API_KEY]
    AutumnKey[AUTUMN_SECRET_KEY]
    WranglerDeploy[Wrangler upload]
  end

  subgraph Public["Public if URL leaks"]
    PreviewURL[*.preview.bl.run]
  end

  Agent[AI agent] --> Safe
  Agent -.-x Host
  DevServer --> PreviewURL
  WranglerDeploy --> Published[id.floras.app]
```

---

## 8. Contact forms on static Pages sites

Published Astro sites have no backend. Forms POST cross-origin to Floras.

```mermaid
sequenceDiagram
  actor Visitor
  participant Site as Astro site<br/>Cloudflare Pages
  participant API as floras.app/api/forms/submit
  participant Convex
  participant Email as Cloudflare Email

  Visitor->>Site: fill contact form
  Site->>API: fetch POST JSON<br/>key + fields
  Note over API: CORS check<br/>pages.dev · floras.app · custom domain
  API->>Convex: forms.submit
  Convex-->>API: ownerEmail
  API->>Email: notify owner
  API-->>Site: 200 ok
  Site-->>Visitor: inline confirmation
```

---

## 9. Billing lanes (BYOK vs Pro)

```mermaid
flowchart TD
  User([User]) --> Plan{Plan}

  Plan -->|BYOK ~$5/mo| BYOK[Your Anthropic key]
  Plan -->|Pro $20/mo| Pro[Platform credits + hosting]

  BYOK --> Preview[Live preview]
  BYOK --> Export[Export tar.gz]
  BYOK -.-x Publish

  Pro --> Preview
  Pro --> Publish[Publish → id.floras.app]
  Pro --> Domain[Custom domains]
  Pro --> Credits[Autumn AI credits]
```

---

## 10. One-page cheat sheet (ASCII)

For platforms without Mermaid rendering:

```text
┌─────────────────────────────────────────────────────────────────┐
│  FLORAS APP (Vercel)          CONVEX (reactive DB)              │
│  ┌──────────┐  ┌─────────────┐  projects · messages · forms    │
│  │ Chat UI  │◄─┤ queries     │                                 │
│  └────┬─────┘  └─────────────┘                                 │
│       │         ┌─────────────┐                                 │
│       └────────►│ API routes  │──► Autumn billing               │
│                 │ generate    │──► AI SDK agent                   │
│                 │ publish     │──► Wrangler → CF Pages          │
│                 │ forms       │                                 │
└─────────────────┼─────────────┼─────────────────────────────────┘
                  │             │
                  ▼             ▼
         ┌────────────┐   ┌──────────┐
         │ BLAXEL VM  │   │ CF R2    │  workspace.tar.gz (source)
         │ Astro /app │──►│ snapshot │  NOT published HTML
         │ :4321 prev │   └──────────┘
         └─────┬──────┘
               │ astro build → dist streamed out
               ▼
         ┌────────────┐
         │ CF PAGES   │  id.floras.app (Pro)
         └────────────┘
```

---

## Usage tips

- **GitHub / GitLab:** paste mermaid blocks as-is in `.md` files.
- **Blog without Mermaid:** use diagram **#10 (ASCII)** or export PNG from [mermaid.live](https://mermaid.live).
- **Short post:** diagrams **#1**, **#5**, and **#6** cover the confusing parts (R2 vs Pages, publish path).
