"use client";

import { LoaderCircle, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePermanentlyDeleteNote, useRestoreNote } from "@/features/notes/hooks/use-notes";
import type { Note } from "@/features/notes/types/note.types";
import { normalizeApiError } from "@/lib/api";

type TrashNoteActionsProps = {
  note: Note;
  onPreview: () => void;
};

export function TrashNoteActions({ note, onPreview }: TrashNoteActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const restore = useRestoreNote();
  const permanentlyDelete = usePermanentlyDeleteNote();

  async function handleRestore() {
    try {
      await restore.mutateAsync(note.id);
      toast.success("Note restored");
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    }
  }

  async function handlePermanentDelete() {
    setDeleteError(null);
    try {
      await permanentlyDelete.mutateAsync(note.id);
      setDeleteOpen(false);
      toast.success("Note permanently deleted");
    } catch (error) {
      setDeleteError(normalizeApiError(error).message);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onPreview}>Preview</Button>
        <Button type="button" variant="outline" size="sm" disabled={restore.isPending} onClick={() => void handleRestore()}>
          {restore.isPending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <RotateCcw aria-hidden="true" />}
          Restore
        </Button>
        <Button type="button" variant="ghost" size="icon" className="size-9 text-destructive" onClick={() => setDeleteOpen(true)} aria-label={`Permanently delete ${note.title}`} title="Permanently delete">
          <Trash2 aria-hidden="true" />
        </Button>
      </div>

      <Dialog open={deleteOpen} onOpenChange={(open) => { setDeleteError(null); setDeleteOpen(open); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Permanently delete this note?</DialogTitle>
            <DialogDescription>“{note.title}” and its related history will be deleted forever. This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {deleteError && <p className="mt-4 text-sm text-destructive" role="alert">{deleteError}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button type="button" variant="destructive" disabled={permanentlyDelete.isPending} onClick={() => void handlePermanentDelete()}>
              {permanentlyDelete.isPending && <LoaderCircle className="animate-spin" aria-hidden="true" />}
              Delete forever
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
