import type { Metadata } from "next";
import Link from "next/link";
import { FlorasLogoMark } from "@/components/brand/floras-logo";
import { Floral } from "@/components/brand/floral";
import { routing } from "@/i18n/routing";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFoundPage() {
  const homeHref = `/${routing.defaultLocale}`;

  return (
    <html lang={routing.defaultLocale}>
      <body className="min-h-[100dvh] bg-background font-sans text-foreground antialiased">
        <div className="relative flex min-h-[100dvh] flex-col overflow-hidden">
          <Floral
            kind="sprig"
            className="pointer-events-none absolute -left-4 top-10 w-28 opacity-70 md:left-6 md:w-36"
          />
          <Floral
            kind="bloom"
            className="pointer-events-none absolute -right-6 bottom-8 w-32 rotate-[18deg] opacity-70 md:right-8 md:w-40"
          />

          <main className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16 md:px-8 md:py-24">
            <div className="mb-8 flex justify-center text-5xl md:text-6xl">
              <FlorasLogoMark />
            </div>

            <p className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Error 404
            </p>
            <h1 className="mx-auto mt-4 max-w-[14ch] text-center text-4xl font-semibold tracking-tight text-foreground md:text-5xl md:leading-[1.1]">
              This page never{" "}
              <span className="relative inline-block whitespace-nowrap px-0.5">
                bloomed.
                <svg
                  aria-hidden
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-x-0 bottom-[-0.06em] h-[0.28em] w-full"
                >
                  <path
                    d="M2 8.5 C40 3.5, 80 10.5, 120 6.5 S180 3, 198 7.5"
                    fill="none"
                    stroke="var(--brand)"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-[42ch] text-center text-base leading-relaxed text-muted-foreground">
              The route is gone — or it never existed. Head home and describe the
              site you meant to build.
            </p>

            <div className="mt-10 flex justify-center">
              <Link
                href={homeHref}
                className="inline-flex h-11 items-center justify-center bg-brand px-7 font-mono text-[11px] uppercase tracking-[0.14em] text-brand-foreground transition-[filter] hover:brightness-110 active:scale-[0.98]"
              >
                Back home
              </Link>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
