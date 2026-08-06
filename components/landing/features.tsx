"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/site/reveal";
import { PageHeader } from "@/components/site/page-header";

const POINT_KEYS = ["looks", "ready", "easy"] as const;

export function Features() {
  const t = useTranslations("features");

  return (
    <section id="features" className="border-b border-border">
      <div className="border-b border-border px-4 py-10 md:px-8 md:py-12">
        <Reveal>
          <PageHeader
            size="section"
            title={t("title")}
            description={t("description")}
            className="md:items-start"
          />
        </Reveal>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
        <Reveal className="border-b border-border lg:border-b-0 lg:border-r">
          <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-brand-soft">
            <div
              aria-hidden
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse 70% 60% at 50% 45%, color-mix(in srgb, var(--brand) 28%, transparent), transparent 70%)",
              }}
            />
            <img
              src="/brand/logo-mark.png"
              alt=""
              aria-hidden
              draggable={false}
              className="relative z-[1] h-[58%] w-auto max-w-[70%] object-contain drop-shadow-sm"
            />
          </div>
          <div className="border-t border-border px-4 py-7 md:px-8">
            <h3 className="text-xl font-semibold tracking-tight">
              {t("asideTitle")}
            </h3>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {t("asideBody")}
            </p>
          </div>
        </Reveal>

        <div className="flex flex-col">
          {POINT_KEYS.map((key, i) => (
            <Reveal
              key={key}
              delay={0.05 * (i + 1)}
              className={`flex flex-1 flex-col justify-center px-4 py-8 md:px-8 ${
                i < POINT_KEYS.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <h3 className="text-lg font-semibold tracking-tight">
                {t(`points.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`points.${key}.body`)}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
