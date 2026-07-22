import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Container } from "@/components/site/container";
import { PricingTableClient } from "@/components/pricing/pricing-table-client";

export default function PricingPage() {
  return (
    <>
      <SiteNav />
      <main>
        <Container className="py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Simple, usage-based pricing
            </h1>
            <p className="mt-4 text-muted-foreground">
              Start free. Upgrade when you need more generations.
            </p>
          </div>
          <div className="mx-auto mt-14 max-w-4xl">
            <PricingTableClient />
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
