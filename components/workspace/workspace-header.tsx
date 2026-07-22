import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export function WorkspaceHeader({
  name,
  previewUrl,
}: {
  name?: string;
  previewUrl?: string;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/60 px-4">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="size-8">
          <Link href="/dashboard">
            <ArrowLeft className="size-4" />
            <span className="sr-only">Back to dashboard</span>
          </Link>
        </Button>
        <Logo />
        <span className="hidden text-sm text-muted-foreground sm:inline">
          / {name ?? "…"}
        </span>
      </div>
      {previewUrl ? (
        <Button asChild variant="outline" size="sm">
          <a href={previewUrl} target="_blank" rel="noreferrer">
            Open preview <ExternalLink className="ml-1.5 size-3.5" />
          </a>
        </Button>
      ) : null}
    </header>
  );
}
