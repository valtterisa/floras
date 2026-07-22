import { cn } from "@/lib/utils";
import type { ElementType, ReactNode } from "react";

export function Container({
  as: Tag = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-6xl px-6", className)}>{children}</Tag>
  );
}
