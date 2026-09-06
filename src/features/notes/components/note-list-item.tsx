import { Pin, Star } from "lucide-react";
import Link from "next/link";

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

export function NoteListItem({ note }: { note: Note }) {
  return (
    <article className={cn("rounded-xl border shadow-card", noteBackgroundClasses[note.backgroundColor])}>
      <Link href={`/notes/${note.id}`} className="grid min-h-24 gap-3 rounded-xl px-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center" aria-label={`Open ${note.title}`}>
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="truncate text-sm font-semibold">{note.title}</h2>
            {note.pinned && <Pin className="size-3.5 shrink-0 fill-primary text-primary" aria-label="Pinned note" />}
            {note.favorite && <Star className="size-3.5 shrink-0 fill-warning text-warning" aria-label="Favorite note" />}
          </div>
          <p className="mt-1 truncate text-sm text-muted-foreground">{note.plainText || "No text in this note yet."}</p>
        </div>
        <div className="flex items-center gap-3 sm:justify-end">
          <Badge variant="secondary" className="max-w-32 truncate">{note.category?.name ?? "Uncategorized"}</Badge>
          <time dateTime={note.updatedAt} className="shrink-0 text-xs text-muted-foreground">{formatNoteUpdatedAt(note.updatedAt)}</time>
        </div>
      </Link>
    </article>
  );
}
