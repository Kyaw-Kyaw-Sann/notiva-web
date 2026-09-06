"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { TrashNoteActions } from "@/features/notes/components/trash/trash-note-actions";
import { TrashNotePreviewDialog } from "@/features/notes/components/trash/trash-note-preview-dialog";
import type { Note, NoteBackgroundColor } from "@/features/notes/types/note.types";
import { formatNoteUpdatedAt } from "@/features/notes/utils/format-note-updated-at";
import { cn } from "@/lib/utils";

const noteBackgroundClasses: Record<NoteBackgroundColor, string> = {
  DEFAULT: "bg-note-default",
  YELLOW: "bg-note-yellow",
  GREEN: "bg-note-green",
  BLUE: "bg-note-blue",
  PINK: "bg-note-pink",
  PURPLE: "bg-note-purple",
  GRAY: "bg-note-gray",
};

export function TrashNotes({ layout, notes }: { layout: "grid" | "list"; notes: Note[] }) {
  const [previewNoteId, setPreviewNoteId] = useState<number | null>(null);

  return (
    <>
      <div className={layout === "grid" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" : "space-y-3"}>
        {notes.map((note) => (
          <article key={note.id} className={cn("rounded-xl border p-5 shadow-card", noteBackgroundClasses[note.backgroundColor], layout === "grid" && "flex min-h-56 flex-col")}>
            <div className="min-w-0">
              <h2 className={cn("font-semibold tracking-tight", layout === "list" ? "truncate text-sm" : "line-clamp-2 text-base")}>{note.title}</h2>
              <p className={cn("mt-2 text-sm leading-6 text-muted-foreground", layout === "list" ? "truncate" : "line-clamp-4")}>{note.plainText || "No text in this note."}</p>
            </div>
            <div className={cn("flex flex-wrap items-center justify-between gap-3", layout === "grid" ? "mt-auto pt-5" : "mt-4")}>
              <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="max-w-32 truncate">{note.category?.name ?? "Uncategorized"}</Badge>
                {note.deletedAt && <time dateTime={note.deletedAt}>Deleted {formatNoteUpdatedAt(note.deletedAt)}</time>}
              </div>
              <TrashNoteActions note={note} onPreview={() => setPreviewNoteId(note.id)} />
            </div>
          </article>
        ))}
      </div>
      <TrashNotePreviewDialog noteId={previewNoteId} onOpenChange={(open) => { if (!open) setPreviewNoteId(null); }} />
    </>
  );
}
