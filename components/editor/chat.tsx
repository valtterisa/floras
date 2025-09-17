"use client";

import { MessageCircleIcon, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Input } from "@/components/ui/input";
import { Message } from "@/components/chat/message";
import { Panel, PanelHeader } from "@/components/panels/panels";
import { Settings } from "@/components/settings/settings";
import { useChat } from "@ai-sdk/react";
import { useCallback, useEffect, useState } from "react";
import { useSharedChatContext } from "../../lib/chat-context";
import { useSettings } from "@/components/settings/use-settings";
import { useSandboxStore } from "../../app/state";

interface Props {
  className: string;
  modelId?: string;
  appName?: string;
}

export function Chat({ className, appName }: Props) {
  const [input, setInput] = useState("");
  const { chat } = useSharedChatContext();
  const { modelId, reasoningEffort } = useSettings();
  const { messages, sendMessage, status } = useChat({ chat });
  const { setChatStatus } = useSandboxStore();
  const [history, setHistory] = useState<
    Array<{ id: string; role: "user" | "assistant"; text: string }>
  >([]);
  const [fatalError, setFatalError] = useState<string | null>(null);

  const validateAndSubmitMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      if (status !== "ready") return;
      // Persist the user message to Redis immediately (source of truth)
      try {
        console.log("[Chat] save user request", {
          appName,
          len: text.length,
          preview: text.slice(0, 120),
        });
        fetch("/api/chat/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ appName, content: text, role: "user" }),
        })
          .then((r) => {
            console.log("[Chat] save user result", {
              ok: r.ok,
              status: r.status,
            });
          })
          .catch((e) => console.error("[Chat] save user error", e));
      } catch (_) {}
      sendMessage({ text }, { body: { modelId, reasoningEffort, appName } });
      setInput("");
    },
    [sendMessage, modelId, setInput, reasoningEffort, appName, status]
  );

  useEffect(() => {
    setChatStatus(status);
  }, [status, setChatStatus]);

  // Persist assistant messages to Redis only after streaming finishes
  useEffect(() => {
    if (!appName) return;
    if (status !== "ready") return; // wait until stream completes
    try {
      const seen =
        (window as any).__builddrr_saved_msg_ids || new Set<string>();
      (window as any).__builddrr_saved_msg_ids = seen;
      const latest = messages[messages.length - 1];
      if (!latest || seen.has(latest.id)) return;
      if (latest.role !== "assistant" && latest.role !== "user") return;
      // Extract plain text from parts if present
      const text = Array.isArray((latest as any).parts)
        ? (latest as any).parts
            .filter(
              (p: any) => p?.type === "text" && typeof p.text === "string"
            )
            .map((p: any) => p.text)
            .join("\n")
        : typeof (latest as any).content === "string"
          ? (latest as any).content
          : "";
      if (!text?.trim()) return;
      seen.add(latest.id);
      fetch("/api/chat/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ appName, content: text, role: latest.role }),
      })
        .then((r) =>
          console.log("[Chat] save assistant result", {
            ok: r.ok,
            status: r.status,
          })
        )
        .catch((e) => console.error("[Chat] save assistant error", e));
    } catch (e: any) {
      setFatalError(
        e?.message ||
          "Chat encountered a fatal error. Please reload the editor and try again."
      );
    }
  }, [messages, appName, status]);

  // Auto-start generation if a namespaced prompt exists for this app
  useEffect(() => {
    if (!appName) return;
    if (status !== "ready") return;
    try {
      const namespacedKey = `builddrr_generation_prompt:${appName}`;
      const legacyKey = "builddrr_generation_prompt";
      const pending =
        sessionStorage.getItem(namespacedKey) ||
        sessionStorage.getItem(legacyKey);
      if (pending && pending.trim()) {
        sessionStorage.removeItem(namespacedKey);
        sessionStorage.removeItem(legacyKey);
        const initial = `Project: ${appName}\n\n${pending}`;
        validateAndSubmitMessage(initial);
      }
    } catch (_) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appName, status]);

  // Load existing chat history on mount (hydrate UI only)
  useEffect(() => {
    if (!appName) return;
    fetch(`/api/chat/history?appName=${encodeURIComponent(appName)}`, {
      credentials: "same-origin",
    })
      .then(async (r) => {
        if (!r.ok) {
          const text = await r.text().catch(() => "");
          console.error("[Chat] history fetch failed", {
            status: r.status,
            body: text?.slice(0, 200),
          });
          throw new Error(`history ${r.status}`);
        }
        return r.json();
      })
      .then((data) => {
        if (!Array.isArray(data?.messages)) return;
        try {
          console.log("[Chat] history raw", {
            appName,
            count: data.messages.length,
            sample: data.messages.slice(0, 3),
          });
        } catch (_) {}
        const mapped = data.messages
          .map((m: any, i: number) => ({
            id: `${m.id || ""}-${i}`,
            role: m.role === "user" ? "user" : "assistant",
            text: typeof m.text === "string" ? m.text : "",
          }))
          .filter((m: any) => m.text && m.text.trim().length > 0);
        try {
          console.log("[Chat] history mapped", {
            appName,
            count: mapped.length,
            sample: mapped.slice(0, 3),
          });
        } catch (_) {}
        // Avoid setState loops by checking if identical
        const sameSize = mapped.length === history.length;
        if (
          !sameSize ||
          mapped.some(
            (
              m: { id: string; role: "user" | "assistant"; text: string },
              i: number
            ) =>
              !history[i] ||
              history[i].id !== m.id ||
              history[i].role !== m.role ||
              history[i].text !== m.text
          )
        ) {
          setHistory(mapped);
        }
      })
      .catch((e) => {
        setFatalError(
          "Failed to load chat history. You can still continue chatting."
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appName]);

  return (
    <Panel className={className}>
      <PanelHeader>
        <div className="flex items-center font-mono font-semibold uppercase">
          <MessageCircleIcon className="mr-2 w-4" />
          Chat
        </div>
        <div className="ml-auto font-mono text-xs opacity-50">[{status}]</div>
      </PanelHeader>

      {/* Messages Area */}
      <Conversation className="relative w-full">
        {fatalError ? (
          <div className="p-3 text-sm text-red-600 font-mono border-b border-red-300 bg-red-50">
            {fatalError}
          </div>
        ) : null}
        <ConversationContent className="space-y-4">
          {history.map((m, i) => (
            <Message
              key={`hist-${m.id}-${i}`}
              message={
                {
                  id: `hist-${m.id}-${i}`,
                  role: m.role as any,
                  parts: [{ type: "text", text: m.text }] as any,
                } as any
              }
            />
          ))}
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <form
        className="flex items-center p-2 space-x-1 border-t border-primary/18 bg-background"
        onSubmit={async (event) => {
          event.preventDefault();
          if (status !== "ready") return;
          validateAndSubmitMessage(input);
        }}
      >
        <Settings />
        <Input
          className="w-full font-mono text-sm rounded-sm border-0 bg-background"
          disabled={status === "streaming" || status === "submitted"}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          value={input}
        />
        <Button type="submit" disabled={status !== "ready" || !input.trim()}>
          <SendIcon className="w-4 h-4" />
        </Button>
      </form>
    </Panel>
  );
}
