import type { ReactNode } from "react";
import { SiteNav } from "@/components/site/site-nav";
import { MarketingAtmosphere } from "@/components/site/marketing-atmosphere";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="astro-shell relative min-h-[100dvh] bg-transparent">
      <MarketingAtmosphere />
      <div className="relative z-0 border-b border-border">
        <div className="mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col border-x border-border">
          <SiteNav />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
