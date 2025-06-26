"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, LoaderCircle, Sparkles } from "lucide-react";
import { getChatMessages, sendChatMessage } from "@/app/actions";
import ReactMarkdown from "react-markdown";
import { useChatStreamStore, ChatMessage } from "@/lib/chat-stream-store";

interface ChatInterfaceProps {
  className?: string;
  onSendMessage?: (message: string) => Promise<any>;
  appName?: string;
  userId?: string;
  isAutoProcessing?: boolean;
}

export default function ChatInterface({
  className,
  onSendMessage,
  appName,
  userId,
  isAutoProcessing = false,
}: ChatInterfaceProps) {
  const { isStreaming, streamedContent } = useChatStreamStore();
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  console.log("🔄 [ChatInterface] Render state:", {
    isStreaming,
    isAutoProcessing,
    streamedContentLength: streamedContent.length,
    inputValueLength: inputValue.length
  });

  return (
    <div className={className}>
      <div className="flex-1 overflow-y-auto p-4">
        {streamedContent ? (
          <div className="bg-muted/30 rounded-lg p-4 border border-muted mb-4">
            <ReactMarkdown>{streamedContent}</ReactMarkdown>
          </div>
        ) : null}
        {isAutoProcessing && !isStreaming && (
          <div className="bg-muted/30 rounded-lg p-4 border border-muted mb-4">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">AI is processing your request...</span>
            </div>
          </div>
        )}
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log("📤 [ChatInterface] Form submitted, input value:", inputValue.substring(0, 30) + "...");

          if (!inputValue.trim() || isStreaming || isAutoProcessing) {
            console.log("⏭️ [ChatInterface] Form submission blocked:", {
              hasInput: !!inputValue.trim(),
              isStreaming,
              isAutoProcessing
            });
            return;
          }

          try {
            console.log("🚀 [ChatInterface] Calling onSendMessage");
            if (onSendMessage) await onSendMessage(inputValue);
            console.log("✅ [ChatInterface] onSendMessage completed");
          } catch (error) {
            console.error("❌ [ChatInterface] Error in onSendMessage:", error);
          } finally {
            setInputValue("");
          }
        }}
        className="flex items-end gap-2 p-4 border-t bg-background"
      >
        <textarea
          ref={textareaRef}
          className="flex-1 resize-none rounded border p-2"
          rows={1}
          value={inputValue}
          onChange={(e) => {
            console.log("📝 [ChatInterface] Input changed, length:", e.target.value.length);
            setInputValue(e.target.value);
          }}
          placeholder="Type your request..."
          disabled={isStreaming || isAutoProcessing}
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={isStreaming || isAutoProcessing || !inputValue.trim()}
        >
          {isStreaming ? "Streaming..." : isAutoProcessing ? "Processing..." : "Send"}
        </button>
      </form>
    </div>
  );
}
