"use client";

import { BotMessageSquare, LoaderCircle, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AiConversation } from "@/features/ai/types/ai.types";
import { cn } from "@/lib/utils";

type ConversationListProps = {
  conversations: AiConversation[];
  createError?: string;
  creating: boolean;
  onCreate: () => void;
  onSelect: (conversationId: number) => void;
  selectedId: number | null;
};

export function ConversationList({ conversations, createError, creating, onCreate, onSelect, selectedId }: ConversationListProps) {
  return (
    <aside className="flex h-full min-h-0 flex-col border-b bg-surface/60 md:border-b-0 md:border-r" aria-label="AI conversations">
      <div className="sticky top-0 z-10 border-b bg-surface px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div><h2 className="text-sm font-semibold">Conversations</h2><p className="text-xs text-muted-foreground">{conversations.length} total</p></div>
          <Button type="button" size="icon" className="hidden size-9 md:inline-flex" disabled={creating} onClick={onCreate} aria-label="New all-notes conversation">
            {creating ? <LoaderCircle className="animate-spin" /> : <Plus />}
          </Button>
        </div>
        <Button type="button" className="mt-3 w-full md:hidden" disabled={creating} onClick={onCreate}>
          {creating ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Plus aria-hidden="true" />}
          {creating ? "Creating…" : "New conversation"}
        </Button>
        {createError && <p className="mt-2 text-xs text-destructive" role="alert">{createError}</p>}
      </div>
      <div className="notiva-scrollbar min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
        {conversations.length === 0 && <div className="px-3 py-10 text-center"><BotMessageSquare className="mx-auto size-6 text-muted-foreground" /><p className="mt-3 text-sm font-medium">No conversations yet</p><p className="mt-1 text-xs text-muted-foreground">Create one to start asking your notes.</p></div>}
        {conversations.map((conversation) => (
          <button key={conversation.id} type="button" className={cn("w-full rounded-lg px-3 py-3 text-left transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring", selectedId === conversation.id && "bg-primary/10 text-primary")} onClick={() => onSelect(conversation.id)} aria-pressed={selectedId === conversation.id}>
            <span className="block truncate text-sm font-medium">{conversation.title}</span>
            <span className="mt-1 block truncate text-xs text-muted-foreground">{conversation.note?.title ?? "All notes"}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
