import { NoteWorkspace } from "@/features/notes/components/note-workspace";

export default async function NotePage({ params }: { params: Promise<{ noteId: string }> }) {
  const { noteId } = await params;

  return <NoteWorkspace noteId={Number(noteId)} />;
}
