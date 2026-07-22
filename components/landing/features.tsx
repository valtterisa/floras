import { Boxes, Gauge, PencilRuler } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { Section } from "@/components/site/section";

export function Features() {
  return (
    <Section id="features">
      <Reveal>
        <PageHeader
          as="h2"
          size="section"
          title="Built to look intentional, not templated."
          description="Structured plans, real sandboxes, and design rules that kill the usual AI site tells."
        />
      </Reveal>

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-16">
        <Reveal>
          <article>
            <div className="overflow-hidden rounded-2xl border border-border/60">
              <img
                src="https://picsum.photos/seed/builddrr-workspace-preview/1400/900"
                alt="Builddrr workspace with chat and live site preview"
                className="aspect-[16/10] h-full w-full object-cover"
              />
            </div>
            <div className="mt-6 flex gap-3">
              <PencilRuler className="mt-0.5 size-5 shrink-0 text-brand" />
              <div>
                <h3 className="text-xl font-semibold tracking-tight">
                  Design rules in the agent
                </h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  One accent, real type hierarchy, varied layouts, and no purple-glow defaults.
                  The scaffold ships a complete Astro project you can keep editing in chat.
                </p>
              </div>
            </div>
          </article>
        </Reveal>

        <div className="flex flex-col justify-center divide-y divide-border/60 border-y border-border/60">
          <Reveal delay={0.05}>
            <article className="py-8">
              <div className="flex gap-3">
                <Boxes className="mt-0.5 size-5 shrink-0 text-brand" />
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    Structured output
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    A typed site schema drives a deterministic Astro scaffold. No brittle parsing of
                    model text.
                  </p>
                </div>
              </div>
            </article>
          </Reveal>
          <Reveal delay={0.1}>
            <article className="py-8">
              <div className="flex gap-3">
                <Gauge className="mt-0.5 size-5 shrink-0 text-brand" />
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    Live sandbox preview
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Each project runs in its own Box VM with a real Astro dev server on a public URL.
                  </p>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
