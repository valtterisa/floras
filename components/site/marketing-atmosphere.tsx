import { Floral } from "@/components/brand/floral";

export function MarketingAtmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--atmosphere)]"
    >
      <div
        className="absolute left-1/2 top-[28%] h-[420px] w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-70"
        style={{
          background:
            "radial-gradient(closest-side, var(--atmosphere-spot), transparent)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.28] dark:opacity-[0.2]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--atmosphere-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--atmosphere-grid) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 55% at 50% 30%, black 20%, transparent 75%)",
        }}
      />

      <Floral
        kind="sprig"
        className="absolute -left-4 top-[10%] w-40 opacity-[0.35] dark:opacity-[0.28] md:w-56 lg:w-72"
      />
      <Floral
        kind="bloom"
        className="absolute -right-6 top-[32%] w-44 rotate-[18deg] opacity-[0.32] dark:opacity-[0.26] md:w-60 lg:w-80"
      />
      <Floral
        kind="bouquet"
        className="absolute bottom-[12%] left-[8%] w-36 -rotate-[12deg] opacity-[0.3] dark:opacity-[0.24] md:w-48"
      />
      <Floral
        kind="corner"
        className="absolute bottom-[6%] right-[10%] w-40 rotate-[8deg] opacity-[0.32] dark:opacity-[0.25] md:w-52"
      />
    </div>
  );
}
