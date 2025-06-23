"use client";

import ChatInterface from "@/components/chat/chat-interface";

import { useEffect, useState } from "react";

import WebsitePreview from "@/components/editor/website-preview";
import { useToast } from "@/hooks/use-toast";
import EditorHeader from "./editor-header";
import { generateSite, getChatMessages, sendChatMessage, getVirtualFileSystem, updateVirtualFileSystem, generateFileUpdatesStream, type Operation } from "@/app/actions";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DevMode from "./dev-mode";
import { useEditorStore } from "@/lib/editor-store";
import type { EditorState } from "@/lib/editor-store";
import { useChatStreamStore } from "@/lib/chat-stream-store";

export default function EditorPageClient({
  id,
  user,
  machine,
  appExists,
}: {
  id: string;
  user: any;
  machine: any;
  appExists: boolean;
}) {
  const [appName, setAppName] = useState<string>(id);
  const isEditMode = useEditorStore((s: EditorState) => s.isEditMode);
  const setEditMode = useEditorStore((s: EditorState) => s.setEditMode);
  const [websiteUrl, setWebsiteUrl] = useState<string | null>(id);
  const [activeTab, setActiveTab] = useState<string>("chat");

  const { toast } = useToast();

  const [machineData, setMachineData] = useState<any>(machine);

  // Zustand chat state
  const { setMessages, addMessage, startStream, updateStream, finishStream, streamedContent } = useChatStreamStore();

  // Hydrate Zustand from Redis on mount
  useEffect(() => {
    if (user?.id && machine?.app_name) {
      getChatMessages(user.id, machine.app_name).then(setMessages);
    }
  }, [user?.id, machine?.app_name, setMessages]);

  useEffect(() => {
    setMachineData(machine);
  }, [machine]);

  useEffect(() => {
    const prompt = sessionStorage.getItem("builddrr_generation_prompt");

    if (!prompt) {
      toast({
        title: "Error Creating Website",
        description: "Please try again.",
      });
      return;
    }

    console.log("🔄 Calling generateSite...");
    if (appExists) {
      generateSite(
        prompt,
        user.user.id,
        appName,
        machine[0].id
      )
        .then((result) => {
          console.log("✅ generateSite returned:", result);
          toast({
            title: "Website Created",
            description: "Your website has been created and is ready to use.",
          });
        })
        .catch((error) => {
          console.error("❌ generateSite error:", error);
          toast({
            title: "Error Creating Website",
            description: "Something went wrong during deployment.",
          });
        });
    }
  }, [id, user]);

  useEffect(() => {
    if (isEditMode) {
      setActiveTab("dev");
    } else {
      setActiveTab("chat");
    }
  }, [isEditMode]);

  const handleSendMessage = async (message: string) => {
    const userMsg = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);
    if (user?.id && machine?.app_name) {
      await sendChatMessage(user.id, machine.app_name, userMsg.content, true);
    }

    let currentFiles: Record<string, string> = {};
    if (user?.id && machine?.app_name) {
      currentFiles = (await getVirtualFileSystem(user.id, machine.app_name)) || {};
    }
    startStream();
    let aiContent = "";
    let fileOps: Operation[] = [];
    console.log("[handleSendMessage] Streaming file updates...");
    for await (const chunk of generateFileUpdatesStream(message, currentFiles)) {
      console.log("[handleSendMessage] Received chunk:", chunk);
      if (chunk.type === "analysis") {
        updateStream(chunk.content || "");
        aiContent += chunk.content || "";
        console.log("[handleSendMessage] Updated streamedContent:", streamedContent);
      } else if (chunk.type === "done" && chunk.operations) {
        fileOps = chunk.operations;
      }
    }
    finishStream();
    // Auto-apply file operations to VFS
    if (user?.id && machine?.app_name && fileOps.length > 0) {
      let updatedFiles: Record<string, string> = { ...currentFiles };
      for (const op of fileOps) {
        if (op.operation === "write" && op.path && op.content !== undefined) {
          updatedFiles[op.path] = op.content;
        } else if (op.operation === "delete" && op.path) {
          delete updatedFiles[op.path];
        } else if (op.operation === "rename" && op.path && op.newPath) {
          updatedFiles[op.newPath] = updatedFiles[op.path];
          delete updatedFiles[op.path];
        }
      }
      await updateVirtualFileSystem(user.id, machine.app_name, updatedFiles);
    }
    // Show AI reasoning and confirmation in chat
    const aiMsg = {
      id: Date.now().toString(),
      content: `<component-analysis>${aiContent}</component-analysis>\n\n${fileOps.length} file operations applied to your site.`,
      isUser: false,
      timestamp: new Date().toISOString(),
    };
    addMessage(aiMsg);
    if (user?.id && machine?.app_name) {
      await sendChatMessage(user.id, machine.app_name, aiMsg.content, false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <EditorHeader
        id={id}
      />

      <div className="flex flex-row gap-4 h-full rounded-3xl">
        <div className="md:w-[500px] flex flex-col h-full">
          <Tabs
            value={activeTab}
            onValueChange={(tab) => {
              setActiveTab(tab);
              setEditMode(tab === "dev");
            }}
            className="h-full flex flex-col"
            defaultValue="chat"
            orientation="vertical"
          >
            <TabsList className="items-start justify-start">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="dev">Design</TabsTrigger>
            </TabsList>
            <TabsContent
              value="chat"
              className="h-full flex-1 mt-0 flex flex-col"
              asChild
            >
              <ChatInterface
                onSendMessage={handleSendMessage}
                appName={appName}
                userId={user.user.id}
              />
            </TabsContent>
            <TabsContent
              value="dev"
              className="h-full flex-1 mt-0 flex flex-col"
              asChild
            >
              <DevMode
                show={true}
                position={{ top: 100, left: 100 }}
                activeFormats={{ bold: false, italic: false, underline: false }}
                elementType={"div"}
                selectedElement={null}
                onFormatText={() => { }}
                onSetBackgroundColor={() => { }}
                onSetBackgroundImage={() => { }}
                onSetLink={() => { }}
                onSetAltTag={() => { }}
                onClose={() => setEditMode(false)}
                activeTextColor={null}
                setActiveTextColor={() => { }}
                onRemoveStandalone={() => { }}
                canRemoveStandalone={false}
              />
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex flex-col flex-1 min-w-0 h-full bg-background rounded-3xl">
          <WebsitePreview
            isEditMode={isEditMode}
            initialUrl={websiteUrl || undefined}
            id={id}
            machine={machineData}
          />
        </div>
      </div>
    </div>
  );
}
