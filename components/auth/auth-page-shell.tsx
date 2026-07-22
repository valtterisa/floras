import { Suspense, type ReactNode } from "react";
import { MarketingLayout } from "@/components/site/marketing-layout";
import { Floral } from "@/components/brand/floral";

function AuthFloralPanel() {
  return (
    <div
      aria-hidden
      className="relative hidden min-h-[28rem] overflow-hidden border-b border-border bg-[color-mix(in_srgb,var(--atmosphere)_88%,var(--brand)_12%)] md:block md:min-h-full md:border-b-0 md:border-r"
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 45% 55%, var(--atmosphere-spot), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.22] dark:opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--atmosphere-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--atmosphere-grid) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 50%, black 25%, transparent 80%)",
        }}
      />

      <Floral
        kind="corner"
        className="absolute -left-6 -top-4 w-36 rotate-[-8deg] opacity-90 lg:w-44"
      />
      <Floral
        kind="sprig"
        className="absolute left-[8%] top-[18%] w-28 -rotate-[18deg] opacity-85 lg:w-36"
      />
      <Floral
        kind="bouquet"
        className="absolute bottom-[8%] left-1/2 w-[72%] max-w-[22rem] -translate-x-1/2 opacity-95 lg:w-[78%]"
      />
      <Floral
        kind="bloom"
        className="absolute -right-4 top-[42%] w-32 rotate-[16deg] opacity-90 lg:w-40"
      />
    </div>
  );
}

function AuthFloralMobile() {
  return (
    <div
      aria-hidden
      className="relative h-36 overflow-hidden border-b border-border bg-[color-mix(in_srgb,var(--atmosphere)_88%,var(--brand)_12%)] md:hidden"
    >
      <Floral
        kind="sprig"
        className="absolute -left-3 top-2 w-24 -rotate-[12deg] opacity-90"
      />
      <Floral
        kind="bouquet"
        className="absolute bottom-[-18%] left-1/2 w-40 -translate-x-1/2 opacity-95"
      />
      <Floral
        kind="bloom"
        className="absolute -right-4 top-4 w-28 rotate-[14deg] opacity-90"
      />
    </div>
  );
}

export function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <MarketingLayout>
      <div className="border-b border-border">
        <AuthFloralMobile />
        <div className="grid md:min-h-[min(72dvh,40rem)] md:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)] lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,28rem)]">
          <AuthFloralPanel />
          <div className="flex flex-col justify-center bg-card/40 px-6 py-10 md:px-8 md:py-14">
            <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Account
            </p>
            <Suspense
              fallback={
                <p className="text-sm text-muted-foreground">Loading…</p>
              }
            >
              {children}
            </Suspense>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
