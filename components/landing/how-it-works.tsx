import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { Section } from "@/components/site/section";

const STEPS = [
  {
    title: "Describe",
    body: "Write one sentence about the site. Builddrr reads the brief and picks a design direction.",
  },
  {
    title: "Generate",
    body: "A typed plan becomes a full Astro project in a fresh Box sandbox with a live dev server.",
  },
  {
    title: "Refine",
    body: "Chat to change copy, sections, and color. Keep a blog if you need one. The preview updates as it builds.",
  },
];

export function HowItWorks() {
  return (
    <Section id="how" bordered>
      <Reveal>
        <PageHeader as="h2" size="section" title="From sentence to site." />
      </Reveal>

      <ol className="mt-16 divide-y divide-border/60 border-y border-border/60">
        {STEPS.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.06}>
            <li className="grid gap-4 py-10 md:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)] md:gap-12">
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                {step.title}
              </h3>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:pt-1.5">
                {step.body}
              </p>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
