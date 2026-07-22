import { cn } from "@/lib/utils";

export const FLORALS = {
  sprig: "/florals/sprig.png",
  bouquet: "/florals/bouquet.png",
  corner: "/florals/corner.png",
  bloom: "/florals/bloom.png",
} as const;

export type FloralKind = keyof typeof FLORALS;

export function Floral({
  kind,
  className,
  alt = "",
}: {
  kind: FloralKind;
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src={FLORALS[kind]}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      draggable={false}
      className={cn("pointer-events-none select-none object-contain", className)}
    />
  );
}
