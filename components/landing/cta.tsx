import Link from "next/link";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="py-28">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-brand px-8 py-20 text-center text-brand-foreground">
            <div className="absolute inset-0 -z-10 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.5), transparent 45%)" }} />
            <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
              Your next site is one sentence away.
            </h2>
            <Button
              asChild
              size="lg"
              className="mt-8 rounded-full bg-background px-7 text-foreground hover:bg-background/90"
            >
              <Link href="/signin">Start building free</Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
