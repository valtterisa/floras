"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, LoaderCircle, Sparkles, Bug } from "lucide-react";
import {
  getChatMessages,
  sendChatMessage,
  debugRedisMessages,
} from "@/app/actions";
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
  const { isStreaming, streamedContent, messages } = useChatStreamStore();
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLTextAreaElement>(null);

  // Debug logging for props
  useEffect(() => {
    console.log("🔍 [ChatInterface] Props received:", {
      appName,
      userId,
      hasOnSendMessage: !!onSendMessage,
      isAutoProcessing,
    });
  }, [appName, userId, onSendMessage, isAutoProcessing]);

  // Auto-scroll to bottom when messages or streamed content changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedContent]);

  // Auto-grow textarea height
  useEffect(() => {
    if (textareaRef.current && shadowRef.current) {
      shadowRef.current.value = inputValue || "";
      const scrollHeight = shadowRef.current.scrollHeight;
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(scrollHeight) + "px";
    }
  }, [inputValue]);

  return (
    <div
      className={cn(
        "flex flex-col min-h-0 w-full max-h-[calc(100vh-5rem)]",
        className
      )}
    >
      <div className="flex flex-col-reverse flex-1 min-h-0 w-full">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!inputValue.trim() || isStreaming || isAutoProcessing) {
              return;
            }
            try {
              if (onSendMessage) await onSendMessage(inputValue);
            } catch (error) {
              console.error("Error in onSendMessage:", error);
            } finally {
              setInputValue("");
            }
          }}
          className="flex items-end p-4 bg-background border-t"
          style={{ boxShadow: "0 -2px 8px 0 rgba(0,0,0,0.02)" }}
        >
          <div className="relative flex-1">
            {/* Hidden shadow textarea for measuring height */}
            <textarea
              ref={shadowRef}
              className="absolute z-[-1] top-0 left-0 w-full h-0 opacity-0 pointer-events-none resize-none"
              tabIndex={-1}
              aria-hidden="true"
              rows={1}
              readOnly
            />
            <textarea
              ref={textareaRef}
              className="flex-1 w-full rounded-xl bg-muted px-4 py-3 pr-10 text-sm shadow-none border-none outline-none focus:ring-0 focus:outline-none placeholder:text-muted-foreground/70 transition resize-none scrollbar-none"
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a follow up..."
              spellCheck={false}
              disabled={isStreaming || isAutoProcessing}
              style={{
                minHeight: "2.5rem",
                overflow: "hidden",
                maxHeight: "none",
              }}
            />
            <button
              type="submit"
              className="absolute bottom-1/2 translate-y-1/2 right-2 bg-primary text-white rounded-full p-2 shadow-sm hover:bg-primary/90 disabled:opacity-50 transition"
              disabled={isStreaming || isAutoProcessing || !inputValue.trim()}
              tabIndex={0}
              aria-label="Send"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </form>
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {/* Render existing chat messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="text-sm">
                  {message.isUser ? (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  ) : (
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  )}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    message.isUser
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {/* Show streamed content */}
          {streamedContent ? (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                <ReactMarkdown>{streamedContent}</ReactMarkdown>
              </div>
            </div>
          ) : null}

          {/* Show auto-processing indicator */}
          {isAutoProcessing && !isStreaming && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm text-muted-foreground">
                    AI is processing your request...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Invisible div for auto-scrolling */}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
