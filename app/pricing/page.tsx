import { MarketingLayout } from "@/components/site/marketing-layout";
import { Container } from "@/components/site/container";
import { PageHeader } from "@/components/site/page-header";
import { PricingTableClient } from "@/components/pricing/pricing-table-client";

export default function PricingPage() {
  return (
    <MarketingLayout>
      <Container className="py-20 md:py-24">
        <PageHeader
          title="Simple, usage-based pricing"
          description="Start free. Upgrade when you need more generations."
        />
        <div className="mt-14 max-w-4xl">
          <PricingTableClient />
        </div>
      </Container>
    </MarketingLayout>
  );
}
