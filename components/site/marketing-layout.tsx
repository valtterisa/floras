import type { ReactNode } from "react";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { MarketingAtmosphere } from "@/components/site/marketing-atmosphere";
import { Floral } from "@/components/brand/floral";

export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="astro-shell relative min-h-[100dvh] bg-transparent">
      <MarketingAtmosphere />
      <div className="relative z-0 flex min-h-[100dvh] flex-col border-b border-border">
        <div className="relative mx-auto flex w-full min-h-[100dvh] max-w-6xl flex-1 flex-col border-x border-border bg-background/80 dark:bg-background/85">
          <Floral
            kind="sprig"
            className="absolute -left-[4.5rem] top-28 hidden w-16 opacity-80 xl:block"
          />
          <Floral
            kind="bloom"
            className="absolute -right-[5rem] top-[22rem] hidden w-20 rotate-[14deg] opacity-80 xl:block"
          />
          <Floral
            kind="bouquet"
            className="absolute -left-[4.75rem] top-[48rem] hidden w-16 -rotate-[8deg] opacity-75 xl:block"
          />
          <Floral
            kind="corner"
            className="absolute -right-[5rem] top-[70rem] hidden w-20 opacity-80 xl:block"
          />
          <SiteNav />
          <main className="flex flex-1 flex-col">{children}</main>
          <SiteFooter />
        </div>
      </div>
    </div>
  );
}
