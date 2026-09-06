"use client";

import { LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeleteAiConversation, useUpdateAiConversation } from "@/features/ai/hooks/use-ai-conversations";
import type { AiConversation } from "@/features/ai/types/ai.types";
import { normalizeApiError } from "@/lib/api";

export function ConversationHeader({ conversation, onDeleted }: { conversation: AiConversation; onDeleted: () => void }) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [title, setTitle] = useState(conversation.title);
  const [error, setError] = useState<string | null>(null);
  const updateConversation = useUpdateAiConversation(conversation.id);
  const deleteConversation = useDeleteAiConversation();

  async function rename() {
    const nextTitle = title.trim();
    if (!nextTitle) return;
    setError(null);
    try {
      await updateConversation.mutateAsync({ title: nextTitle });
      setRenameOpen(false);
      toast.success("Conversation renamed");
    } catch (requestError) {
      setError(normalizeApiError(requestError).message);
    }
  }

  async function remove() {
    setError(null);
    try {
      await deleteConversation.mutateAsync(conversation.id);
      setDeleteOpen(false);
      onDeleted();
      toast.success("Conversation deleted");
    } catch (requestError) {
      setError(normalizeApiError(requestError).message);
    }
  }

  return (
    <>
      <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0"><h2 className="truncate text-sm font-semibold">{conversation.title}</h2><p className="truncate text-xs text-muted-foreground">{conversation.note?.title ?? "Across all notes"}</p></div>
        <div className="flex shrink-0 items-center gap-1">
          <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => { setTitle(conversation.title); setError(null); setRenameOpen(true); }} aria-label="Rename conversation"><Pencil aria-hidden="true" /></Button>
          <Button type="button" variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => { setError(null); setDeleteOpen(true); }} aria-label="Delete conversation"><Trash2 aria-hidden="true" /></Button>
        </div>
      </header>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Rename conversation</DialogTitle><DialogDescription>Use a short title that makes this conversation easy to find.</DialogDescription></DialogHeader>
          <div className="mt-5 space-y-2"><Label htmlFor="conversation-title">Title</Label><Input id="conversation-title" value={title} maxLength={100} onChange={(event) => setTitle(event.target.value)} /></div>
          {error && <p className="mt-3 text-sm text-destructive" role="alert">{error}</p>}
          <DialogFooter><Button type="button" variant="outline" onClick={() => setRenameOpen(false)}>Cancel</Button><Button type="button" disabled={!title.trim() || updateConversation.isPending} onClick={() => void rename()}>{updateConversation.isPending && <LoaderCircle className="animate-spin" />}Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete this conversation?</DialogTitle><DialogDescription>The conversation and its message history will be permanently removed. Your notes will not be changed.</DialogDescription></DialogHeader>
          {error && <p className="mt-3 text-sm text-destructive" role="alert">{error}</p>}
          <DialogFooter><Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button><Button type="button" variant="destructive" disabled={deleteConversation.isPending} onClick={() => void remove()}>{deleteConversation.isPending && <LoaderCircle className="animate-spin" />}Delete conversation</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
