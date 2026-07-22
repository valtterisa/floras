import Link from "next/link";
import { cn } from "@/lib/utils";

export function BuilddrrLogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/brand/logo-mark.svg"
      alt=""
      aria-hidden
      draggable={false}
      className={cn("size-[1em] shrink-0 object-contain", className)}
    />
  );
}

export function BuilddrrLogo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-[0.4em] text-[18px] font-semibold leading-none tracking-tight text-foreground",
        className
      )}
    >
      <BuilddrrLogoMark />
      <span>Builddrr</span>
    </Link>
  );
}
