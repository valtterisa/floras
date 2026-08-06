"use client";

import { useTranslations } from "next-intl";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Briefcase01Icon,
  Coffee01Icon,
  PaintBoardIcon,
  Store01Icon,
} from "@hugeicons/core-free-icons";
import { Reveal } from "@/components/site/reveal";

const AUDIENCE_KEYS = [
  { key: "shops", icon: Store01Icon },
  { key: "creators", icon: PaintBoardIcon },
  { key: "consultants", icon: Briefcase01Icon },
  { key: "cafes", icon: Coffee01Icon },
] as const satisfies ReadonlyArray<{
  key: string;
  icon: IconSvgElement;
}>;

export function LogoWall() {
  const t = useTranslations("logoWall");

  return (
    <section className="border-b border-border">
      <div className="grid sm:grid-cols-[9rem_1fr]">
        <div className="flex items-center border-b border-border px-4 py-4 sm:border-b-0 sm:border-r md:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {t("title")}
          </p>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-4">
          {AUDIENCE_KEYS.map(({ key, icon }, i) => (
            <li
              key={key}
              className={`flex h-14 items-center justify-center gap-2 border-border px-3 text-center text-sm text-muted-foreground ${
                i % 2 === 0 ? "border-r" : ""
              } sm:border-r sm:last:border-r-0 ${i < 2 ? "border-b sm:border-b-0" : ""}`}
            >
              <Reveal>
                <span className="inline-flex items-center gap-2">
                  <HugeiconsIcon
                    icon={icon}
                    size={16}
                    strokeWidth={1.5}
                    className="shrink-0"
                    aria-hidden
                  />
                  {t(`audiences.${key}`)}
                </span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
