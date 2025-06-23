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
}

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

// Function to fetch messages from localStorage as a fallback
const getMessagesFromLocalStorage = (userId?: string, appName?: string) => {
  if (!userId || !appName) return [];

  const storageKey = `chat:${userId}:${appName}`;
  const storedMessages = localStorage.getItem(storageKey);

  if (storedMessages) {
    try {
      return JSON.parse(storedMessages);
    } catch (error) {
      console.error("Error parsing stored messages:", error);
      return [];
    }
  }

  return [];
};

// Helper function to extract and render component-analysis blocks
const renderMessageContent = (content: string, isUser: boolean) => {
  if (isUser) {
    return content;
  }

  console.log("🚀 ~ renderMessageContent ~ content:", content)

  // Check if the message contains a component-analysis block
  const componentAnalysisMatch = content.match(/<component-analysis>([\s\S]*?)<\/component-analysis>/);

  if (componentAnalysisMatch) {
    const analysisContent = componentAnalysisMatch[1];
    const beforeAnalysis = content.substring(0, content.indexOf('<component-analysis>'));
    const afterAnalysis = content.substring(content.indexOf('</component-analysis>') + '</component-analysis>'.length);

    return (
      <>
        {beforeAnalysis && <div className="mb-4">{beforeAnalysis}</div>}
        <div className="bg-muted/30 rounded-lg p-4 border border-muted mb-4">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-foreground">{children}</h1>,
              h2: ({ children }) => <h2 className="text-base font-semibold mb-2 mt-4 text-foreground">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 mt-3 text-foreground">{children}</h3>,
              p: ({ children }) => <p className="mb-2 text-foreground">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1 text-foreground">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1 text-foreground">{children}</ol>,
              li: ({ children }) => <li className="text-sm text-foreground">{children}</li>,
              code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono text-foreground">{children}</code>,
              pre: ({ children }) => <pre className="bg-muted p-2 rounded text-xs overflow-x-auto mb-2 text-foreground">{children}</pre>,
              strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
              em: ({ children }) => <em className="italic text-foreground">{children}</em>,
            }}
          >
            {analysisContent}
          </ReactMarkdown>
        </div>
        {afterAnalysis && <div>{afterAnalysis}</div>}
      </>
    );
  }

  // If no component-analysis block, render as plain text
  return content;
};

export default function ChatInterface({
  className,
  onSendMessage,
  appName,
  userId,
}: ChatInterfaceProps) {
  const { isStreaming, streamedContent } = useChatStreamStore();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Only show the <component-analysis> block contents as markdown
  const renderMarkdown = (content: string) => {
    // Extract <component-analysis>...</component-analysis> block
    const match = content.match(/<component-analysis>([\s\S]*?)<\/component-analysis>/);
    if (match) {
      return (
        <ReactMarkdown>{match[1]}</ReactMarkdown>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      <div className="flex-1 overflow-y-auto p-4">
        {isStreaming && streamedContent ? (
          <div className="bg-muted/30 rounded-lg p-4 border border-muted mb-4">
            {renderMarkdown(`<component-analysis>${streamedContent}</component-analysis>`)}
          </div>
        ) : null}
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!inputValue.trim() || isLoading) return;
          setIsLoading(true);
          try {
            if (onSendMessage) await onSendMessage(inputValue);
          } finally {
            setIsLoading(false);
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
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your request..."
          disabled={isLoading || isStreaming}
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={isLoading || isStreaming || !inputValue.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
