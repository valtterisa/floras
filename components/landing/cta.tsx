import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/site/container";

export function CallToAction() {
  return (
    <section className="border-t border-border/60 bg-brand py-24 text-brand-foreground md:py-32">
      <Container>
        <Reveal>
          <PageHeader
            as="h2"
            size="section"
            title="Your next site is one sentence away."
            actions={
              <Button
                asChild
                size="lg"
                className="rounded-full bg-background px-7 text-foreground hover:bg-background/90 active:scale-[0.98]"
              >
                <Link href="/signin">Start building</Link>
              </Button>
            }
          />
        </Reveal>
      </Container>
    </section>
  );
}
