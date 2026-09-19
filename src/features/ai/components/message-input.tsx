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
    <div className="border-t bg-background px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
      <div className="rounded-xl border bg-surface p-2 focus-within:ring-2 focus-within:ring-ring">
        <Textarea
          value={message}
          maxLength={3000}
          rows={2}
          disabled={disabled}
          placeholder="Ask your notes…"
          className="min-h-16 resize-none border-0 bg-transparent p-2 shadow-none focus-visible:ring-0 sm:min-h-20"
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
          <span className="hidden text-[11px] text-muted-foreground sm:inline">Enter to send · Shift+Enter for a new line</span>
          <span className="text-[11px] text-muted-foreground sm:hidden">Up to 3,000 characters</span>
          <Button type="button" size="icon" className="size-11 sm:size-9" disabled={disabled || !message.trim()} onClick={() => void submit()} aria-label="Send message">
            {disabled ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
