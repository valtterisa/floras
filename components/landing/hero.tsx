import { Reveal } from "@/components/site/reveal";
import { LandingComposer } from "@/components/landing/landing-composer";

export function Hero() {
  return (
    <section className="border-b border-border">
      <div className="border-b border-border px-6 py-8 md:px-8">
        <Reveal>
          <h1 className="text-center text-3xl font-semibold tracking-tight text-[#0d0f14] md:text-4xl">
            Astro sites from one sentence.
          </h1>
        </Reveal>
      </div>
      <div className="px-6 py-10 md:px-8 md:py-14">
        <Reveal delay={0.06} className="mx-auto w-full max-w-2xl">
          <LandingComposer />
        </Reveal>
      </div>
    </section>
  );
}
