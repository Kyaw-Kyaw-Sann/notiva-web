"use client";

import { LoaderCircle, MessageCircle, Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AiChatPanel } from "@/features/ai/components/ai-chat-panel";
import { ConversationList } from "@/features/ai/components/conversation-list";
import { SemanticSearch } from "@/features/ai/components/semantic-search";
import { useAiConversations, useCreateAllNotesConversation } from "@/features/ai/hooks/use-ai-conversations";
import { normalizeApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

export function AiConversationsPage() {
  const [view, setView] = useState<"chat" | "search">("chat");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const conversations = useAiConversations();
  const createConversation = useCreateAllNotesConversation();
  const activeId = selectedId ?? conversations.data?.[0]?.id ?? null;
  const activeConversation = conversations.data?.find((conversation) => conversation.id === activeId) ?? null;

  async function create() {
    try {
      const conversation = await createConversation.mutateAsync(undefined);
      setSelectedId(conversation.id);
    } catch {
      // The mutation error is rendered below.
    }
  }

  return (
    <section className="mx-auto flex h-[calc(100dvh-8rem)] min-h-[38rem] w-full max-w-7xl flex-col">
      <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">AI Conversations</h1><p className="mt-1 text-sm text-muted-foreground">Chat across your notes or search them by meaning.</p></div>
        <div className="inline-flex w-fit rounded-lg border bg-surface p-1" role="group" aria-label="AI workspace view">
          <Button type="button" variant={view === "chat" ? "secondary" : "ghost"} size="sm" onClick={() => setView("chat")} aria-pressed={view === "chat"}><MessageCircle />Conversations</Button>
          <Button type="button" variant={view === "search" ? "secondary" : "ghost"} size="sm" onClick={() => setView("search")} aria-pressed={view === "search"}><Search />Ask your notes</Button>
        </div>
      </header>

      {view === "search" ? <div className="notiva-scrollbar flex-1 overflow-y-auto pb-6"><SemanticSearch /></div> : (
        <div className="grid min-h-0 flex-1 grid-rows-[minmax(12rem,35%)_minmax(0,1fr)] overflow-hidden rounded-2xl border bg-background shadow-card md:grid-cols-[17rem_minmax(0,1fr)] md:grid-rows-1">
          {conversations.isLoading ? <div className="flex items-center justify-center border-r"><LoaderCircle className="size-6 animate-spin text-primary" aria-label="Loading conversations" /></div> : conversations.isError ? <div className="border-r p-4 text-sm" role="alert"><p>{normalizeApiError(conversations.error).message}</p><Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => void conversations.refetch()}>Try again</Button></div> : <ConversationList conversations={conversations.data ?? []} creating={createConversation.isPending} onCreate={() => void create()} onSelect={setSelectedId} selectedId={activeId} />}
          <div className={cn("min-h-0", conversations.isLoading && "md:col-start-2")}>
            {activeConversation ? <AiChatPanel conversation={activeConversation} onDeleted={() => setSelectedId(null)} /> : <div className="flex h-full min-h-80 flex-col items-center justify-center px-6 text-center"><MessageCircle className="size-9 text-primary" /><h2 className="mt-4 font-semibold">Chat across all notes</h2><p className="mt-1 max-w-sm text-sm text-muted-foreground">Create an all-notes conversation to ask questions using your Notiva knowledge.</p><Button type="button" className="mt-5" disabled={createConversation.isPending} onClick={() => void create()}>{createConversation.isPending && <LoaderCircle className="animate-spin" />}New conversation</Button>{createConversation.isError && <p className="mt-3 text-xs text-destructive" role="alert">{normalizeApiError(createConversation.error).message}</p>}</div>}
          </div>
        </div>
      )}
    </section>
  );
}
