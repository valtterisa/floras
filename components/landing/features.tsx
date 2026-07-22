import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { Boxes, Gauge, PencilRuler, Rocket } from "lucide-react";

export function Features() {
  return (
    <section id="features" className="py-28">
      <Container>
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
            A generator that respects the craft.
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Structured output, real sandboxes, and an agent tuned to avoid the
            templated look most tools ship.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3 md:grid-rows-2">
          <Reveal className="md:col-span-2 md:row-span-2">
            <article className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-8">
              <div>
                <PencilRuler className="size-6 text-brand" />
                <h3 className="mt-5 text-2xl font-semibold tracking-tight">
                  Anti-slop by design
                </h3>
                <p className="mt-3 max-w-md text-muted-foreground">
                  Every build follows a strict design system: one locked accent,
                  real typographic hierarchy, motivated motion, and zero of the
                  tells that make AI sites look identical.
                </p>
              </div>
              <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border/60">
                <img
                  src="https://picsum.photos/seed/nebula-editor-canvas/1200/675"
                  alt="Generated site preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.05}>
            <article className="h-full rounded-3xl border border-border/60 bg-brand/10 p-7">
              <Boxes className="size-6 text-brand" />
              <h3 className="mt-5 text-xl font-semibold tracking-tight">
                Structured output
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                A typed site schema drives a deterministic Astro scaffold. No
                brittle parsing of model text.
              </p>
            </article>
          </Reveal>

          <Reveal delay={0.1}>
            <article className="h-full rounded-3xl border border-border/60 bg-card/40 p-7">
              <Gauge className="size-6 text-brand" />
              <h3 className="mt-5 text-xl font-semibold tracking-tight">
                Live sandbox preview
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Each project runs in its own Box VM with a real dev server on a
                public URL.
              </p>
            </article>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
