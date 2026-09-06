"use client";

import { LoaderCircle, MessageCircle, Plus } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AiChatPanel } from "@/features/ai/components/ai-chat-panel";
import { useAiConversations, useCreateNoteConversation } from "@/features/ai/hooks/use-ai-conversations";
import { normalizeApiError } from "@/lib/api";

const desktopQuery = "(min-width: 1280px)";
function subscribeDesktop(callback: () => void) { const query = window.matchMedia(desktopQuery); query.addEventListener("change", callback); return () => query.removeEventListener("change", callback); }
function getDesktopSnapshot() { return window.matchMedia(desktopQuery).matches; }
function getServerSnapshot() { return false; }

export function NoteChatWorkspace({ noteId, noteTitle, onOpenChange, open }: { noteId: number; noteTitle: string; onOpenChange: (open: boolean) => void; open: boolean }) {
  const isDesktop = useSyncExternalStore(subscribeDesktop, getDesktopSnapshot, getServerSnapshot);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const conversations = useAiConversations();
  const createConversation = useCreateNoteConversation(noteId);
  const noteConversations = conversations.data?.filter((conversation) => conversation.type === "NOTE_CHAT" && conversation.note?.id === noteId) ?? [];
  const activeId = selectedId ?? noteConversations[0]?.id ?? null;
  const activeConversation = noteConversations.find((conversation) => conversation.id === activeId) ?? null;

  async function create() {
    try {
      const conversation = await createConversation.mutateAsync(undefined);
      setSelectedId(conversation.id);
    } catch {
      // The normalized query error is rendered below.
    }
  }

  const content = (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="flex items-center gap-2 border-b px-4 py-3 pr-12">
        <MessageCircle className="size-4 shrink-0 text-primary" aria-hidden="true" />
        <select className="h-9 min-w-0 flex-1 rounded-md border bg-surface px-2 text-sm" value={activeId ?? ""} onChange={(event) => setSelectedId(Number(event.target.value))} aria-label="Note conversation">
          {noteConversations.length === 0 && <option value="">Chat with {noteTitle}</option>}
          {noteConversations.map((conversation) => <option key={conversation.id} value={conversation.id}>{conversation.title}</option>)}
        </select>
        <Button type="button" variant="outline" size="icon" className="size-9" disabled={createConversation.isPending} onClick={() => void create()} aria-label="New note conversation">{createConversation.isPending ? <LoaderCircle className="animate-spin" /> : <Plus />}</Button>
        {isDesktop && <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Close</Button>}
      </div>
      {conversations.isLoading && <div className="flex flex-1 items-center justify-center"><LoaderCircle className="size-6 animate-spin text-primary" aria-label="Loading conversations" /></div>}
      {conversations.isError && <div className="m-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm" role="alert"><p>{normalizeApiError(conversations.error).message}</p><Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => void conversations.refetch()}>Try again</Button></div>}
      {!conversations.isLoading && !conversations.isError && activeConversation && <div className="min-h-0 flex-1"><AiChatPanel conversation={activeConversation} onDeleted={() => setSelectedId(null)} /></div>}
      {!conversations.isLoading && !conversations.isError && !activeConversation && <div className="flex flex-1 flex-col items-center justify-center px-6 text-center"><MessageCircle className="size-8 text-primary" /><h3 className="mt-4 font-medium">Chat with this note</h3><p className="mt-1 max-w-xs text-sm text-muted-foreground">Create a conversation to ask questions based on this note.</p><Button type="button" className="mt-5" disabled={createConversation.isPending} onClick={() => void create()}>{createConversation.isPending && <LoaderCircle className="animate-spin" />}Start conversation</Button></div>}
      {createConversation.isError && <p className="mx-4 mb-4 text-xs text-destructive" role="alert">{normalizeApiError(createConversation.error).message}</p>}
    </div>
  );

  if (!open) return null;
  if (isDesktop) return <aside className="sticky top-5 h-[calc(100vh-2.5rem)] min-h-[36rem] overflow-hidden rounded-2xl border shadow-card" aria-label="Chat with this note">{content}</aside>;

  return <Dialog open onOpenChange={onOpenChange}><DialogContent className="left-0 top-0 h-dvh w-full max-w-none translate-x-0 translate-y-0 overflow-hidden rounded-none border-0 p-0 md:left-auto md:right-0 md:w-[28rem] md:border-l"><DialogTitle className="sr-only">Chat with this note</DialogTitle>{content}</DialogContent></Dialog>;
}
