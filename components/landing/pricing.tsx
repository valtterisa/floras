"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/site/reveal";
import { PageHeader } from "@/components/site/page-header";
import { PricingTableClient } from "@/components/pricing/pricing-table-client";

export function Pricing() {
  const t = useTranslations("pricing");

  return (
    <section id="pricing" className="border-b border-border">
      <div className="border-b border-border px-4 py-10 md:px-8 md:py-12">
        <Reveal>
          <PageHeader
            size="section"
            title={t("title")}
            description={t("description")}
            className="md:items-start"
          />
        </Reveal>
      </div>
      <Reveal delay={0.06}>
        <PricingTableClient />
      </Reveal>
    </section>
  );
}
