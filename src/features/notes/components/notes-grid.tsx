import { NoteCard } from "@/features/notes/components/note-card";
import type { Note } from "@/features/notes/types/note.types";

export function NotesGrid({ notes }: { notes: Note[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {notes.map((note) => <NoteCard key={note.id} note={note} />)}
    </div>
  );
}
