import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="flex flex-col justify-between gap-10 p-8 md:flex-row md:items-end md:p-10">
        <div>
          <Logo />
          <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-muted-foreground">
            Describe your business. Get a website you can open and share.
          </p>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <nav
            aria-label="Legal"
            className="flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
          >
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <a
              href="https://quickshops.app"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Quickshops
            </a>
          </nav>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            &copy; {new Date().getFullYear()} Floras
          </p>
        </div>
      </div>
      <div className="flex justify-center border-t border-border">
        <a
          href="https://valtterisavonen.fi"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-3 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:bg-background hover:text-foreground md:px-6"
        >
          Made by Valtteri Savonen
        </a>
      </div>
    </footer>
  );
}
