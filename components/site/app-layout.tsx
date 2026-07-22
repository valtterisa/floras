import type { ReactNode } from "react";
import { SiteNav } from "@/components/site/site-nav";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteNav />
      <main>{children}</main>
    </>
  );
}
