import { Bot, UserRound } from "lucide-react";

import type { AiMessage } from "@/features/ai/types/ai.types";
import { cn } from "@/lib/utils";

function formatMessageTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date);
}

export function MessageList({ messages }: { messages: AiMessage[] }) {
  if (messages.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary"><Bot aria-hidden="true" /></span>
        <h3 className="mt-4 font-medium">Start a conversation</h3>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">Ask a focused question and Notiva will answer from your notes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-4 py-5" aria-live="polite">
      {messages.map((message) => {
        const isUser = message.role === "USER";
        return (
          <article key={message.id} className={cn("flex items-start gap-2.5", isUser && "flex-row-reverse")}>
            <span className={cn("mt-1 flex size-8 shrink-0 items-center justify-center rounded-full", isUser ? "bg-primary text-primary-foreground" : "border bg-surface text-primary")}>
              {isUser ? <UserRound className="size-4" aria-hidden="true" /> : <Bot className="size-4" aria-hidden="true" />}
            </span>
            <div className={cn("max-w-[82%] rounded-2xl px-4 py-3", isUser ? "rounded-tr-sm bg-primary/10" : "rounded-tl-sm border bg-surface")}>
              <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
              <time className="mt-2 block text-[11px] text-muted-foreground" dateTime={message.createdAt}>{formatMessageTime(message.createdAt)}</time>
            </div>
          </article>
        );
      })}
    </div>
  );
}
