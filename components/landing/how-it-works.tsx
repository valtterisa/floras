"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/site/reveal";
import { PageHeader } from "@/components/site/page-header";

const STEP_KEYS = ["0", "1", "2"] as const;

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <section id="how" className="border-b border-border">
      <div className="border-b border-border px-4 py-10 md:px-8 md:py-12">
        <Reveal>
          <PageHeader
            size="section"
            title={t("title")}
            className="md:items-start"
          />
        </Reveal>
      </div>

      <ol>
        {STEP_KEYS.map((key, i) => (
          <li
            key={key}
            className={`grid md:grid-cols-[minmax(0,0.28fr)_minmax(0,0.72fr)] ${
              i < STEP_KEYS.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <Reveal
              delay={i * 0.06}
              className="flex items-center border-b border-border px-4 py-8 md:border-b-0 md:border-r md:px-8 md:py-10"
            >
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                {i + 1}. {t(`steps.${key}.title`)}
              </h3>
            </Reveal>
            <Reveal
              delay={i * 0.06 + 0.03}
              className="flex items-center px-4 py-8 md:px-8 md:py-10 md:pl-12"
            >
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                {t(`steps.${key}.body`)}
              </p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
