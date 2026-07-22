import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-lg bg-brand text-brand-foreground",
        className
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none">
        <path
          d="M12 2c1.5 4.5 3.5 6.5 8 8-4.5 1.5-6.5 3.5-8 8-1.5-4.5-3.5-6.5-8-8 4.5-1.5 6.5-3.5 8-8Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="text-[15px] font-semibold tracking-tight">Nebula</span>
    </Link>
  );
}
