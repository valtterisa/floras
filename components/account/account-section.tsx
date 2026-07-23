import type { ReactNode } from "react";

export function AccountSection({
  id,
  title,
  description,
  children,
}: {
  id?: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-6 rounded-3xl border border-border/60 bg-card/40 p-6 md:scroll-mt-8 md:p-8"
    >
      <div className="max-w-2xl">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
