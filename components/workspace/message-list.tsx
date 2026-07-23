"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { cn } from "@/lib/utils";
import { AgentSteps, type Step } from "@/components/workspace/agent-steps";

export interface ChatMessage {
  _id: string;
  role: "user" | "assistant" | "system";
  content: string;
  status: "streaming" | "complete" | "error";
  steps?: Step[];
}

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  return (
    <Conversation className="flex-1">
      <ConversationContent className="mx-auto w-full max-w-2xl gap-5 px-4 py-6">
        {messages.map((message) => {
          const isUser = message.role === "user";
          const streaming = message.status === "streaming";
          return (
            <Message from={isUser ? "user" : "assistant"} key={message._id}>
              <div className="w-full">
                {!isUser && message.steps && (
                  <AgentSteps steps={message.steps} active={streaming} />
                )}
                {(isUser || message.content) && (
                  <MessageContent
                    className={cn(
                      isUser
                        ? "rounded-2xl bg-secondary px-4 py-2.5 text-foreground"
                        : "bg-transparent p-0 text-foreground"
                    )}
                  >
                    {isUser ? (
                      message.content
                    ) : (
                      <MessageResponse isAnimating={streaming}>
                        {message.content}
                      </MessageResponse>
                    )}
                  </MessageContent>
                )}
                {!isUser && !message.content && streaming && (
                  <p className="animate-pulse text-sm text-muted-foreground">
                    Thinking…
                  </p>
                )}
              </div>
            </Message>
          );
        })}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
