"use client";

import { LoaderCircle, Pin, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDeleteNote, useSetNoteFavorite, useSetNotePinned } from "@/features/notes/hooks/use-notes";
import type { Note } from "@/features/notes/types/note.types";
import { normalizeApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

export function NoteActions({ note }: { note: Note }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const setPinned = useSetNotePinned(note.id);
  const setFavorite = useSetNoteFavorite(note.id);
  const deleteNote = useDeleteNote();

  async function handlePinned() {
    try {
      await setPinned.mutateAsync(!note.pinned);
      toast.success(note.pinned ? "Note unpinned" : "Note pinned");
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    }
  }

  async function handleFavorite() {
    try {
      await setFavorite.mutateAsync(!note.favorite);
      toast.success(note.favorite ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    }
  }

  async function handleDelete() {
    setDeleteError(null);
    try {
      await deleteNote.mutateAsync(note.id);
      toast.success("Note moved to Recycle Bin");
      router.replace("/notes");
    } catch (error) {
      setDeleteError(normalizeApiError(error).message);
    }
  }

  return (
    <>
      <div className="flex items-center gap-1" aria-label="Note actions">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("size-9", note.pinned && "bg-primary/10 text-primary")}
          onClick={() => void handlePinned()}
          disabled={setPinned.isPending}
          aria-label={note.pinned ? "Unpin note" : "Pin note"}
          aria-pressed={note.pinned}
          title={note.pinned ? "Unpin note" : "Pin note"}
        >
          {setPinned.isPending ? <LoaderCircle className="animate-spin" /> : <Pin className={cn(note.pinned && "fill-current")} />}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("size-9", note.favorite && "text-warning")}
          onClick={() => void handleFavorite()}
          disabled={setFavorite.isPending}
          aria-label={note.favorite ? "Remove note from favorites" : "Add note to favorites"}
          aria-pressed={note.favorite}
          title={note.favorite ? "Remove from favorites" : "Add to favorites"}
        >
          {setFavorite.isPending ? <LoaderCircle className="animate-spin" /> : <Star className={cn(note.favorite && "fill-current")} />}
        </Button>
        <Button type="button" variant="ghost" size="icon" className="size-9 text-muted-foreground hover:text-destructive" onClick={() => setDeleteOpen(true)} aria-label="Move note to Recycle Bin" title="Move to Recycle Bin">
          <Trash2 />
        </Button>
      </div>

      <Dialog open={deleteOpen} onOpenChange={(open) => { setDeleteError(null); setDeleteOpen(open); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move this note to Recycle Bin?</DialogTitle>
            <DialogDescription>You can restore it later from Recycle Bin. This does not permanently delete the note.</DialogDescription>
          </DialogHeader>
          {deleteError && <p className="mt-4 text-sm text-destructive" role="alert">{deleteError}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={() => void handleDelete()} disabled={deleteNote.isPending}>
              {deleteNote.isPending && <LoaderCircle className="animate-spin" aria-hidden="true" />}
              Move to Recycle Bin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
