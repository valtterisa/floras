import Link from "next/link";
import { Container } from "@/components/site/container";
import { Logo } from "@/components/brand/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-12">
      <Container className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <Logo />
        <nav className="flex gap-8 text-sm text-muted-foreground">
          <Link href="/#features" className="hover:text-foreground">Features</Link>
          <Link href="/#how" className="hover:text-foreground">How it works</Link>
          <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
        </nav>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Nebula
        </p>
      </Container>
    </footer>
  );
}
