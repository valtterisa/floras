"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Container } from "@/components/site/container";
import { PromptComposer } from "@/components/site/prompt-composer";
import { useCreateSite } from "@/lib/hooks/use-create-site";
import { Badge } from "@/components/ui/badge";

interface Project {
  _id: string;
  name: string;
  status: string;
  previewUrl?: string;
  _creationTime: number;
}

const STATUS_TONE: Record<string, string> = {
  ready: "border-brand/40 text-brand",
  error: "border-destructive/40 text-destructive",
};

export function Dashboard() {
  const router = useRouter();
  const projects = useQuery((api as any).projects.list, {}) as
    | Project[]
    | undefined;
  const createSite = useCreateSite();
  const [pending, setPending] = useState(false);

  const handle = async (text: string) => {
    setPending(true);
    try {
      const id = await createSite({ prompt: text });
      router.push(`/build/${id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start generation");
      setPending(false);
    }
  };

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          What are we building today?
        </h1>
        <p className="mt-3 text-muted-foreground">
          Describe a site and Nebula generates it in a live sandbox.
        </p>
        <div className="mt-8">
          <PromptComposer onSubmit={handle} pending={pending} autoFocus />
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-sm font-medium text-muted-foreground">Your sites</h2>
        {projects === undefined ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
        ) : projects.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            No sites yet. Your first generation will show up here.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project._id}
                href={`/build/${project._id}`}
                className="group overflow-hidden rounded-2xl border border-border/60 bg-card/40 transition-colors hover:border-border"
              >
                <div className="aspect-[16/10] overflow-hidden border-b border-border/60 bg-muted/30">
                  {project.previewUrl ? (
                    <iframe
                      src={project.previewUrl}
                      title={project.name}
                      className="pointer-events-none h-[200%] w-[200%] origin-top-left scale-50"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      Preview pending
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 p-4">
                  <span className="truncate text-sm font-medium">
                    {project.name}
                  </span>
                  <Badge
                    variant="outline"
                    className={STATUS_TONE[project.status] ?? "text-muted-foreground"}
                  >
                    {project.status}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
