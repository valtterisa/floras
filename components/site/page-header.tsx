import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  size = "page",
  as: TitleTag = "h1",
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  size?: "page" | "section";
  as?: ElementType;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className="max-w-2xl">
        <TitleTag
          className={cn(
            "font-semibold tracking-tight",
            size === "page"
              ? "text-3xl md:text-4xl lg:text-5xl"
              : "text-3xl md:text-4xl"
          )}
        >
          {title}
        </TitleTag>
        {description ? (
          <p className="mt-3 max-w-xl text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
