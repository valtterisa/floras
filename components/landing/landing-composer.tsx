"use client";

import { useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { PromptComposer } from "@/components/site/prompt-composer";
import { useCreateSite } from "@/lib/hooks/use-create-site";

const SUGGESTIONS = [
  "A landing page for a solar-panel installer",
  "A minimal portfolio for a product designer",
  "A launch page with a blog for an indie coffee roaster",
  "A waitlist page for a developer tool",
];

export function LandingComposer() {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const createSite = useCreateSite();
  const [pending, setPending] = useState(false);

  const handle = async (text: string) => {
    if (!isAuthenticated) {
      router.push(`/signin?prompt=${encodeURIComponent(text)}`);
      return;
    }
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
    <PromptComposer
      onSubmit={handle}
      suggestions={SUGGESTIONS}
      pending={pending}
      autoFocus
    />
  );
}
