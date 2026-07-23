"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  Globe,
  MessageSquareText,
  User,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const SETTINGS_SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "domains", label: "Domains", icon: Globe },
  { id: "instructions", label: "Instructions", icon: MessageSquareText },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  icon: LucideIcon;
}>;

export type SettingsSectionId = (typeof SETTINGS_SECTIONS)[number]["id"];

function scrollToSection(id: SettingsSectionId) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

export function SettingsNav() {
  const [active, setActive] = useState<SettingsSectionId>("profile");

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (SETTINGS_SECTIONS.some((s) => s.id === hash)) {
      setActive(hash as SettingsSectionId);
      requestAnimationFrame(() => scrollToSection(hash as SettingsSectionId));
    }

    const elements = SETTINGS_SECTIONS.map((s) =>
      document.getElementById(s.id)
    ).filter((el): el is HTMLElement => el != null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
        const top = visible[0];
        if (top?.target.id) {
          setActive(top.target.id as SettingsSectionId);
        }
      },
      { rootMargin: "-12% 0px -68% 0px", threshold: [0, 0.25, 0.5] }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav
        aria-label="Settings"
        className="sticky top-0 z-10 -mx-6 border-b border-border bg-background/90 px-6 backdrop-blur-sm md:-mx-8 md:px-8 lg:hidden"
      >
        <ul className="flex gap-1 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SETTINGS_SECTIONS.map(({ id, label }) => (
            <li key={id} className="shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActive(id);
                  scrollToSection(id);
                }}
                className={cn(
                  "h-8 cursor-pointer px-3 text-sm transition-colors active:scale-[0.98]",
                  active === id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                aria-current={active === id ? "true" : undefined}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <nav
        aria-label="Settings"
        className="sticky top-8 hidden w-44 shrink-0 self-start lg:block"
      >
        <p className="text-xs font-medium text-muted-foreground">Settings</p>
        <ul className="mt-3 flex flex-col gap-0.5">
          {SETTINGS_SECTIONS.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => {
                  setActive(id);
                  scrollToSection(id);
                }}
                className={cn(
                  "inline-flex h-9 w-full cursor-pointer items-center gap-2.5 px-2.5 text-sm transition-colors active:scale-[0.98]",
                  active === id
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
                aria-current={active === id ? "true" : undefined}
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.5} />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
