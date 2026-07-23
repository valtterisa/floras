import { DESIGN_SKILL } from "@/lib/ai/design-skill";

export const ASTRO_STACK_OVERRIDE = `RUNTIME STACK (overrides conflicting skill stack advice only)
- Output is Astro components + Tailwind v4 utilities + plain CSS in the sandbox site/.
- Do not install or use React, Next.js, Framer Motion, Motion, GSAP, or Three.js.
- Translate Motion/GSAP/scroll patterns from the skill into CSS-only equivalents: hover/active transitions, optional one-shot .reveal fade-up, transform/opacity only. Respect prefers-reduced-motion.
- Prefer picsum.photos seeded URLs for images (no image-gen tool in this sandbox).
- Icons: inline SVG from Phosphor/Tabler-style geometry is OK when a package is not available; do not invent fake product UIs from divs.
- Dark/light: lock ONE theme via the SitePlan theme field for the whole site (skill dual-mode guidance applies within that locked theme).`;

export const DESIGN_GUIDELINES = `${ASTRO_STACK_OVERRIDE}

DESIGN SKILL (verbatim — follow word for word)
${DESIGN_SKILL}`;
