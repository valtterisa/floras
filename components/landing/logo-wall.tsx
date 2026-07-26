import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Briefcase01Icon,
  Coffee01Icon,
  PaintBoardIcon,
  Store01Icon,
} from "@hugeicons/core-free-icons";
import { Reveal } from "@/components/site/reveal";

const AUDIENCES: ReadonlyArray<{
  label: string;
  icon: IconSvgElement;
}> = [
  { label: "Local shops", icon: Store01Icon },
  { label: "Creators", icon: PaintBoardIcon },
  { label: "Consultants", icon: Briefcase01Icon },
  { label: "Cafés & studios", icon: Coffee01Icon },
];

export function LogoWall() {
  return (
    <section className="border-b border-border">
      <div className="grid sm:grid-cols-[9rem_1fr]">
        <div className="flex items-center border-b border-border px-4 py-4 sm:border-b-0 sm:border-r md:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Made for
          </p>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-4">
          {AUDIENCES.map(({ label, icon }, i) => (
            <li
              key={label}
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
                  {label}
                </span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
