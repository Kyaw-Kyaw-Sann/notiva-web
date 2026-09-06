import { Pin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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

export function NoteCard({ note }: { note: Note }) {
  return (
    <article className={cn("flex min-h-56 flex-col rounded-xl border p-5 shadow-card", noteBackgroundClasses[note.backgroundColor])}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1.5 text-primary">
          {note.pinned && <Pin className="size-4 fill-current" aria-label="Pinned note" />}
        </div>
        {note.favorite && <Star className="size-4 shrink-0 fill-warning text-warning" aria-label="Favorite note" />}
      </div>
      <h2 className="mt-5 line-clamp-2 text-base font-semibold tracking-tight">{note.title}</h2>
      <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground">{note.plainText || "No text in this note yet."}</p>
      <footer className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs text-muted-foreground">
        <Badge variant="secondary" className="max-w-[60%] truncate">{note.category?.name ?? "Uncategorized"}</Badge>
        <time dateTime={note.updatedAt} className="shrink-0">{formatNoteUpdatedAt(note.updatedAt)}</time>
      </footer>
    </article>
  );
}
