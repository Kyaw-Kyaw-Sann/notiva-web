"use client";

import { LoaderCircle, Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function MessageInput({ disabled, onSend }: { disabled: boolean; onSend: (message: string) => Promise<boolean> }) {
  const [message, setMessage] = useState("");

  async function submit() {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;
    if (await onSend(trimmedMessage)) setMessage("");
  }

  return (
    <div className="border-t bg-background p-3">
      <div className="rounded-xl border bg-surface p-2 focus-within:ring-2 focus-within:ring-ring">
        <Textarea
          value={message}
          maxLength={3000}
          rows={3}
          disabled={disabled}
          placeholder="Ask your notes…"
          className="min-h-20 resize-none border-0 bg-transparent p-2 shadow-none focus-visible:ring-0"
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void submit();
            }
          }}
          aria-label="Chat message"
        />
        <div className="flex items-center justify-between gap-3 px-1 pb-1">
          <span className="text-[11px] text-muted-foreground">Enter to send · Shift+Enter for a new line</span>
          <Button type="button" size="icon" className="size-9" disabled={disabled || !message.trim()} onClick={() => void submit()} aria-label="Send message">
            {disabled ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
