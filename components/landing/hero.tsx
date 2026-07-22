import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { LandingComposer } from "@/components/landing/landing-composer";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient background: warm radial + fine grid, no gradient slop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand/15 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 70% 55% at 50% 30%, black 40%, transparent 100%)",
          }}
        />
      </div>

      <Container className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center py-20 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/50 px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-brand" />
            Astro sites, generated and previewed live
          </span>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="mt-7 max-w-4xl text-balance text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
            Ship a real website
            <br />
            from a single sentence.
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Describe your idea. Nebula generates a production-ready Astro site and
            streams a live preview while it builds.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 w-full max-w-2xl">
          <LandingComposer />
        </Reveal>
      </Container>
    </section>
  );
}
