"use client";

import { useCallback, useEffect } from "react";
import { Horizontal, Vertical } from "@/components/layout/panels";
import { TabContent, TabItem } from "@/components/tabs";
import { Chat } from "./chat";
import { Preview } from "./preview";
import { EditorHeader } from "./editor-header";
import { useSandboxStore } from "@/app/state";
import { useSharedChatContext } from "@/lib/chat-context";

interface Props {
  appName?: string;
  repoExists?: boolean;
  projectContext?: string | null;
}

export default function EditorPageClient({
  appName,
  repoExists,
  projectContext,
}: Props) {
  const { setUrl, setSandboxId, url } = useSandboxStore();
  const { chat } = useSharedChatContext();

  const startSandbox = useCallback(async () => {
    if (!appName) return;
    try {
      const res = await fetch("/api/projects/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appName, port: 3000 }),
      });
      const data = await res.json();
      if (!res.ok) return;
      if (data.sandboxId) setSandboxId(data.sandboxId);
      if (data.url) setUrl(data.url, crypto.randomUUID());
    } catch (e) {
      // no-op
    }
  }, [appName, setSandboxId, setUrl]);

  useEffect(() => {
    if (appName && !url && repoExists) {
      startSandbox();
    }
  }, [appName, url, repoExists, startSandbox]);

  // Auto-start generation only if a namespaced prompt exists for this app
  useEffect(() => {
    if (!appName) return;
    const kickoff = () => {
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
          chat.send({ role: "user", parts: [{ type: "text", text: initial }] });
        }
      } catch (_) {}
    };
    // Defer to ensure chat is mounted
    const id = setTimeout(kickoff, 0);
    return () => clearTimeout(id);
  }, [appName, chat]);

  return (
    <>
      <div className="flex flex-col-reverse md:flex-col h-screen max-h-screen overflow-hidden p-2">
        <ul className="flex space-x-5 font-mono text-sm tracking-tight px-1 py-2 md:hidden">
          <TabItem tabId="chat">Chat</TabItem>
          <TabItem tabId="preview">Preview</TabItem>
        </ul>

        {/* Mobile layout tabs taking the whole space*/}
        <div className="flex flex-1 w-full overflow-hidden pt-2 md:hidden">
          <TabContent tabId="chat" className="flex-1">
            <Chat className="flex-1 overflow-hidden" appName={appName} />
          </TabContent>
          <TabContent tabId="preview" className="flex-1">
            <Preview className="flex-1 overflow-hidden" />
          </TabContent>
        </div>

        <EditorHeader />

        {/* Desktop layout with horizontal and vertical panels */}
        <div className="hidden flex-1 w-full min-h-0 overflow-hidden pt-2 md:flex">
          <Horizontal
            defaultLayout={[30, 70]}
            left={
              <Chat
                className="flex-1 overflow-hidden w-full"
                appName={appName}
              />
            }
            right={
              <Vertical
                defaultLayout={[100, 0, 0]}
                top={<Preview className="flex-1 overflow-hidden w-full" />}
                middle={undefined}
                bottom={undefined}
              />
            }
          />
        </div>
      </div>
    </>
  );
}
