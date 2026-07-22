import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { LandingComposer } from "@/components/landing/landing-composer";
import { HeroProductPreview } from "@/components/landing/hero-product-preview";
import { LogoMark } from "@/components/brand/logo";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-[480px] w-[480px] rounded-full bg-brand/12 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 20% 20%, black 20%, transparent 75%)",
          }}
        />
      </div>

      <Container className="grid min-h-[calc(100dvh-4rem)] items-center gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 lg:py-20">
        <div className="max-w-xl">
          <Reveal>
            <div className="flex items-center gap-3">
              <LogoMark className="size-9 rounded-xl" />
              <span className="text-2xl font-semibold tracking-tight md:text-3xl">
                Builddrr
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-8 text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-[3.5rem]">
              Ship a real Astro site from one sentence.
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[36ch] text-base leading-relaxed text-muted-foreground md:text-lg">
              Type a brief. Get a production Astro project with a live sandbox preview.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-8 w-full">
            <LandingComposer />
          </Reveal>
        </div>

        <Reveal delay={0.12} className="w-full lg:justify-self-end">
          <HeroProductPreview />
        </Reveal>
      </Container>
    </section>
  );
}
