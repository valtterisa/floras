export const DESIGN_SKILL = `# Astro site design (Floras)

Output Astro + Tailwind v4 + plain CSS only. No React, Next.js, GSAP, Framer Motion, or Three.js.

## Design read
Before coding, one line: page kind, audience, vibe, theme (light or dark from SitePlan).

## Dials (default unless brief overrides)
VARIANCE 7 · MOTION 4 · DENSITY 4
Motion = CSS only (hover, transform/opacity, optional one-shot .reveal). Honor prefers-reduced-motion.

## Hard rules
- One accent color; lock theme for the whole site; consistent corner radii.
- No Inter as default (prefer Geist, Outfit, Satoshi, Plus Jakarta Sans). No Fraunces/Instrument Serif defaults.
- No AI-purple gradients, three equal feature cards, glassmorphism spam, em-dashes (—), fake div screenshots.
- Hero: max 2-line headline, ≤20-word subtext, CTA in first viewport, max pt-24 desktop, ≤4 text elements.
- Max 1 eyebrow per 3 sections. No section-number eyebrows. No scroll cues.
- Cards only when elevation helps; prefer space and borders.
- Images: picsum.photos/seed/{descriptive}/{w}/{h}. Inline SVG icons OK (Phosphor/Tabler style).
- Vary section layouts; no 3+ zigzag splits in a row. Bento cells = exact content count.
- Copy: concrete verbs; no Elevate/Seamless/Unleash; re-read every string before finish.

## Contact forms (required for local businesses / contact intents)
When SitePlan has a \`contact\` section (or the brief asks for contact/booking/inquiry):
- Build a real HTML form (name, email, message; phone if in plan). Never mailto-only "forms".
- POST JSON to the Floras submit URL from agent context (FORMS_SUBMIT_URL) with body:
  \`{ "key": FORM_PUBLIC_KEY, "fields": { name, email, message, phone? }, "pagePath": location.pathname, "_hp": "" }\`
- Include a hidden honeypot input named \`_hp\` (leave empty; bots fill it).
- On success show inline confirmation; on error show a short retry message. Disable the button while submitting.
- Use fetch() from a small \`<script>\` in the page or component. No third-party form SaaS.

## Implement
Edit the sandbox project root in place. Complete file writes. Short markdown summary when done.
`;
