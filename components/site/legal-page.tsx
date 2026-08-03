import type { ReactNode } from "react";
import { MarketingLayout } from "@/components/site/marketing-layout";
import { PageHeader } from "@/components/site/page-header";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <MarketingLayout>
      <div className="px-6 py-12 md:px-8 md:py-16">
        <PageHeader
          title={title}
          description={`Last updated ${updated}`}
          className="border-b border-border pb-8"
        />
        <div className="prose-legal mt-10 max-w-2xl space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:mt-10 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </MarketingLayout>
  );
}
