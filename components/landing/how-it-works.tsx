import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";

const STEPS = [
  {
    title: "Describe",
    body: "Type a sentence about the site you want. The agent reads the brief and infers the right design direction.",
  },
  {
    title: "Generate",
    body: "A structured plan becomes a full Astro project inside a fresh sandbox, booted with a live dev server.",
  },
  {
    title: "Refine",
    body: "Keep chatting to adjust copy, sections, colors, and add a blog. The preview updates as it builds.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="border-y border-border/60 bg-card/20 py-28">
      <Container>
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            From sentence to site, in three moves.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/60 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <div className="h-full bg-background p-8">
                <span className="font-mono text-sm text-brand">0{i + 1}</span>
                <h3 className="mt-4 text-xl font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
