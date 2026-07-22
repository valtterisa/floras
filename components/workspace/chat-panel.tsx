"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { MessageList, type ChatMessage } from "@/components/workspace/message-list";
import { PromptComposer } from "@/components/site/prompt-composer";

export function ChatPanel({
  projectId,
  busy,
}: {
  projectId: string;
  busy: boolean;
}) {
  const messages = useQuery((api as any).messages.list, { projectId }) as
    | ChatMessage[]
    | undefined;
  const send = useMutation((api as any).messages.send);

  const handle = async (text: string) => {
    try {
      await send({ projectId, content: text });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not send message");
    }
  };

  return (
    <div className="flex h-full flex-col">
      <MessageList messages={messages ?? []} />
      <div className="border-t border-border/60 p-3">
        <PromptComposer
          onSubmit={handle}
          pending={busy}
          placeholder="Ask for changes — copy, sections, colors, a blog…"
        />
      </div>
    </div>
  );
}
