export type DesignSkillId = "design_taste";

export type DesignSkill = {
  id: DesignSkillId;
  title: string;
  description: string;
  body: string;
};

export const DESIGN_SKILLS: Record<DesignSkillId, DesignSkill> = {
  design_taste: {
    id: "design_taste",
    title: "Design taste (anti-slop)",
    description: "Landings/portfolios; brief inference + dials",
    body: `# Design taste (Floras runtime)

Astro + Tailwind v4 + plain CSS only. No React, Next.js, GSAP, Framer Motion, or Three.js.

## Brief inference
Before planning or coding, one-line Design Read: page kind, audience, vibe, theme (light/dark).
Infer from the user brief — do not default to AI-purple, Inter, three equal feature cards, or glassmorphism spam.

## Dials (default unless brief overrides)
VARIANCE 7 · MOTION 4 · DENSITY 4
- minimalist/calm/editorial → lower variance & motion, airier density
- premium/agency → higher variance, restrained luxury motion
- playful/experimental → higher variance & motion
Motion = CSS only (hover, transform/opacity, optional one-shot .reveal). Honor prefers-reduced-motion.

## Hard rules
- One accent color; lock theme for the whole site; consistent corner radii.
- No Inter as default (prefer Geist, Outfit, Satoshi, Plus Jakarta Sans). No Fraunces/Instrument Serif defaults.
- No em-dashes (—), fake div screenshots, section-number eyebrows, scroll cues.
- Hero: max 2-line headline, ≤20-word subtext, CTA in first viewport, max pt-24 desktop, ≤4 text elements.
- Max 1 eyebrow per 3 sections. Cards only when elevation helps.
- Images: picsum.photos/seed/{descriptive}/{w}/{h}. Inline SVG icons OK (Phosphor/Tabler style).
- Vary section layouts; no 3+ zigzag splits in a row. Bento cells = exact content count.
- Copy: concrete verbs; no Elevate/Seamless/Unleash.

## Contact
Local businesses / bookings: implement a working Floras-backed contact form (FORM_PUBLIC_KEY + FORMS_SUBMIT_URL). Do not use mailto as the only path.

## Implement
Edit the sandbox project in place. Complete file writes. Short markdown summary when done.
`,
  },
};
