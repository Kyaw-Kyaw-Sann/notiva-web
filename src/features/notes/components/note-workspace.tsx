"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ErrorState } from "@/components/common/error-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NoteForm } from "@/features/notes/components/note-form";
import { useNote } from "@/features/notes/hooks/use-notes";
import { normalizeApiError } from "@/lib/api";

export function NewNoteWorkspace() {
  return <NoteForm />;
}

export function NoteWorkspace({ noteId }: { noteId: number }) {
  const isValidNoteId = Number.isSafeInteger(noteId) && noteId > 0;
  const { data: note, error, isError, isLoading, refetch } = useNote(noteId);

  if (!isValidNoteId) {
    return <WorkspaceError title="Invalid note" description="This note address is not valid." />;
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl" aria-label="Loading note">
        <div className="mb-5 flex items-center justify-between border-b pb-5"><Skeleton className="h-10 w-36" /><Skeleton className="h-10 w-44" /></div>
        <div className="rounded-2xl border p-6 sm:p-8"><Skeleton className="h-10 w-3/5" /><Skeleton className="mt-8 h-10 w-full max-w-xl" /><Skeleton className="mt-8 h-[50vh] w-full" /></div>
      </div>
    );
  }

  if (isError || !note) {
    return (
      <WorkspaceError
        title="Could not load note"
        description={normalizeApiError(error).message}
        retry={() => void refetch()}
      />
    );
  }

  return <NoteForm note={note} />;
}

function WorkspaceError({ description, retry, title }: { description: string; retry?: () => void; title: string }) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <Button asChild variant="ghost" className="px-2 text-muted-foreground"><Link href="/notes"><ArrowLeft />Back to all notes</Link></Button>
      <ErrorState title={title} description={description} action={retry && <Button onClick={retry}>Try again</Button>} />
    </div>
  );
}
