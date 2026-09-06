import { NoteListItem } from "@/features/notes/components/note-list-item";
import type { Note } from "@/features/notes/types/note.types";

export function NotesList({ notes }: { notes: Note[] }) {
  return <div className="space-y-3">{notes.map((note) => <NoteListItem key={note.id} note={note} />)}</div>;
}
