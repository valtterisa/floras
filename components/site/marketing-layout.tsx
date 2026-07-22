import type { ReactNode } from "react";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { MarketingAtmosphere } from "@/components/site/marketing-atmosphere";

export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="astro-shell relative min-h-[100dvh] bg-transparent">
      <MarketingAtmosphere />
      <div className="relative z-0 border-b border-border">
        <div className="mx-auto w-full max-w-6xl border-x border-border">
          <SiteNav />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </div>
    </div>
  );
}
