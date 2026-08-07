"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import { LinkSquare02Icon } from "@hugeicons/core-free-icons";
import { Reveal } from "@/components/site/reveal";

export const EXAMPLE_SITE_URL =
  "https://3ane9tar8v2pqkpbbg7ps00hb7mwm191.floras.app/";

export function HeroProductPreview() {
  const t = useTranslations("examplePreview");

  return (
    <section id="example" className="border-b border-border">
      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Reveal className="flex flex-col justify-center gap-5 border-b border-border px-4 py-10 md:px-8 md:py-12 lg:border-b-0 lg:border-r">
          <h2 className="max-w-[16ch] text-2xl font-semibold tracking-tight md:text-3xl">
            {t("title")}
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            {t("description")}
          </p>
          <a
            href={EXAMPLE_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            {t("open")}
            <HugeiconsIcon
              icon={LinkSquare02Icon}
              size={16}
              strokeWidth={1.5}
              aria-hidden
            />
          </a>
        </Reveal>

        <Reveal delay={0.06} className="bg-muted/30 p-4 md:p-6 lg:p-8">
          <a
            href={EXAMPLE_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden border border-border bg-card transition-[filter] hover:brightness-[0.98]"
          >
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              <span className="size-2 rounded-full bg-foreground/15" />
              <span className="size-2 rounded-full bg-foreground/15" />
              <span className="size-2 rounded-full bg-foreground/15" />
              <span className="ml-1 truncate font-mono text-[10px] text-muted-foreground">
                {t("siteLabel")}
              </span>
            </div>
            <div className="relative aspect-[9/4] overflow-hidden bg-paper">
              <Image
                src="/landing/example-plumber.png"
                alt={t("imageAlt")}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                priority={false}
              />
            </div>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
