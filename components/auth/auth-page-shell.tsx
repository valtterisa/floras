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
        className="absolute -left-6 -top-4 w-36 rotate-[-8deg] opacity-80 lg:w-40"
      />
      <Floral
        kind="sprig"
        className="absolute left-[6%] top-[14%] w-24 -rotate-[18deg] opacity-75 lg:w-28"
      />
      <Floral
        kind="bloom"
        className="absolute -right-4 top-[38%] w-28 rotate-[16deg] opacity-75 lg:w-32"
      />

      <img
        src="/brand/logo-mark.png"
        alt=""
        draggable={false}
        className="absolute left-1/2 top-1/2 h-[55%] w-auto max-w-[70%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-sm"
      />
    </div>
  );
}

function AuthFloralMobile() {
  return (
    <div
      aria-hidden
      className="relative flex h-40 items-center justify-center overflow-hidden border-b border-border bg-[color-mix(in_srgb,var(--atmosphere)_88%,var(--brand)_12%)] md:hidden"
    >
      <Floral
        kind="sprig"
        className="absolute -left-3 top-2 w-20 -rotate-[12deg] opacity-70"
      />
      <Floral
        kind="bloom"
        className="absolute -right-4 top-3 w-20 rotate-[14deg] opacity-70"
      />
      <img
        src="/brand/logo-mark.png"
        alt=""
        draggable={false}
        className="relative z-[1] h-[70%] w-auto object-contain"
      />
    </div>
  );
}

export function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <MarketingLayout>
      <div className="flex flex-1 flex-col border-b border-border">
        <AuthFloralMobile />
        <div className="grid flex-1 md:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)] lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,28rem)]">
          <AuthFloralPanel />
          <div className="flex flex-col justify-center bg-card/40 px-6 py-10 md:px-8 md:py-14">
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
