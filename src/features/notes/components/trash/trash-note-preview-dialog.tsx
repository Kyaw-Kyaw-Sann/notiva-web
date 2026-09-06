"use client";

import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NoteEditor } from "@/features/notes/components/editor/note-editor";
import { useTrashedNote } from "@/features/notes/hooks/use-notes";
import { normalizeApiError } from "@/lib/api";

type TrashNotePreviewDialogProps = {
  noteId: number | null;
  onOpenChange: (open: boolean) => void;
};

export function TrashNotePreviewDialog({ noteId, onOpenChange }: TrashNotePreviewDialogProps) {
  const open = noteId !== null;
  const note = useTrashedNote(noteId ?? 0, open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="notiva-scrollbar max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        {note.isLoading && <div className="flex min-h-64 items-center justify-center"><LoaderCircle className="size-6 animate-spin text-primary" aria-label="Loading note preview" /></div>}
        {note.isError && (
          <div className="py-10 text-center">
            <DialogHeader><DialogTitle>Could not load note</DialogTitle><DialogDescription>{normalizeApiError(note.error).message}</DialogDescription></DialogHeader>
            <Button className="mt-5" onClick={() => void note.refetch()}>Try again</Button>
          </div>
        )}
        {note.data && (
          <>
            <DialogHeader>
              <DialogTitle>{note.data.title}</DialogTitle>
              <DialogDescription>{note.data.category?.name ?? "Uncategorized"} · Recycle Bin preview</DialogDescription>
            </DialogHeader>
            <div className="notiva-version-preview mt-5 overflow-hidden rounded-xl border bg-surface-muted/40">
              <NoteEditor contentJson={note.data.contentJson} fallbackPlainText={note.data.plainText} disabled showToolbar={false} onChange={() => undefined} onReadyPlainText={() => undefined} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
