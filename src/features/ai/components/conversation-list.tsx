"use client";

import { BotMessageSquare, LoaderCircle, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AiConversation } from "@/features/ai/types/ai.types";
import { cn } from "@/lib/utils";

export function ConversationList({ conversations, creating, onCreate, onSelect, selectedId }: { conversations: AiConversation[]; creating: boolean; onCreate: () => void; onSelect: (conversationId: number) => void; selectedId: number | null }) {
  return (
    <aside className="flex min-h-0 flex-col border-b bg-surface/60 md:border-b-0 md:border-r" aria-label="AI conversations">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3"><div><h2 className="text-sm font-semibold">Conversations</h2><p className="text-xs text-muted-foreground">{conversations.length} total</p></div><Button type="button" size="icon" className="size-9" disabled={creating} onClick={onCreate} aria-label="New all-notes conversation">{creating ? <LoaderCircle className="animate-spin" /> : <Plus />}</Button></div>
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
