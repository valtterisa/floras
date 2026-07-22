import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Sign in", href: "/signin" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="grid md:grid-cols-[1.15fr_1fr]">
        <div className="flex flex-col justify-between gap-10 border-b border-border p-8 md:border-b-0 md:border-r md:p-10">
          <div>
            <Logo />
            <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-muted-foreground">
              Describe a site. Get a live Astro preview in a real sandbox.
            </p>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            &copy; {new Date().getFullYear()} Builddrr
          </p>
        </div>

        <div className="flex flex-col">
          <div className="border-b border-border px-8 py-4 md:px-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Navigate
            </p>
          </div>
          <ul className="flex flex-1 flex-col">
            {LINKS.map((link) => (
              <li key={link.href} className="border-b border-border last:border-b-0">
                <Link
                  href={link.href}
                  className="flex items-center justify-between px-8 py-4 text-sm text-foreground transition-colors hover:bg-background hover:text-brand md:px-10"
                >
                  <span>{link.label}</span>
                  <span className="font-mono text-[10px] text-muted-foreground" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-2 border-t border-border sm:grid-cols-4">
        {["Astro", "Sandbox", "Preview", "Ship"].map((item) => (
          <div
            key={item}
            className="border-r border-border px-4 py-3 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground last:border-r-0"
          >
            {item}
          </div>
        ))}
      </div>
    </footer>
  );
}
