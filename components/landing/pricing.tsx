import { Reveal } from "@/components/site/reveal";
import { PricingTableClient } from "@/components/pricing/pricing-table-client";

export function Pricing() {
  return (
    <section id="pricing" className="border-b border-border">
      <div className="border-b border-border px-6 py-10 md:px-8 md:py-12">
        <Reveal>
          <h2 className="max-w-[16ch] text-3xl font-semibold tracking-tight md:text-4xl">
            Simple, usage-based pricing.
          </h2>
          <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-muted-foreground">
            Start free. Upgrade when you need more generations.
          </p>
        </Reveal>
      </div>
      <Reveal delay={0.06}>
        <PricingTableClient />
      </Reveal>
    </section>
  );
}
