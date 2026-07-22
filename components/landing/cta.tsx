import Link from "next/link";
import { Reveal } from "@/components/site/reveal";

export function CallToAction() {
  return (
    <section className="relative overflow-hidden border-b border-border text-white">
      <img
        aria-hidden
        alt=""
        src="https://images.unsplash.com/photo-1457089328109-e5d9bd499191?auto=format&fit=crop&w=1600&h=900&q=80"
        className="absolute inset-0 h-full w-full scale-105 object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-multiply opacity-90"
        style={{ backgroundImage: "var(--brand-gradient)" }}
      />
      <div aria-hidden className="absolute inset-0 bg-[#0d0f14]/25" />

      <div className="relative grid gap-0 md:grid-cols-[1fr_auto]">
        <div className="border-b border-white/20 px-6 py-12 md:border-b-0 md:border-r md:px-8 md:py-16">
          <Reveal>
            <h2 className="max-w-[16ch] text-3xl font-semibold tracking-tight md:text-4xl">
              Your next site is one sentence away.
            </h2>
          </Reveal>
        </div>
        <div className="flex items-center justify-center px-6 py-8 md:px-10">
          <Reveal delay={0.06}>
            <Link
              href="/sign-up"
              className="inline-flex h-11 items-center justify-center border border-white/30 bg-white px-7 text-sm font-medium text-[#0d0f14] transition-[filter] hover:brightness-95 active:scale-[0.98]"
            >
              Start building
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
