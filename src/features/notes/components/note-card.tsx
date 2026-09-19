"use client";

import { ExternalLink, LoaderCircle, MoreHorizontal, Pin, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDeleteNote, useSetNoteFavorite, useSetNotePinned } from "@/features/notes/hooks/use-notes";
import type { Note, NoteBackgroundColor } from "@/features/notes/types/note.types";
import { formatNoteUpdatedAt } from "@/features/notes/utils/format-note-updated-at";
import { normalizeApiError } from "@/lib/api";
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

const categoryDotClasses = ["bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];

export function NoteCard({ note }: { note: Note }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const setPinned = useSetNotePinned(note.id);
  const setFavorite = useSetNoteFavorite(note.id);
  const deleteNote = useDeleteNote();
  const categoryDotClass = note.category
    ? categoryDotClasses[Math.abs(note.category.id) % categoryDotClasses.length]
    : "bg-muted-foreground/40";

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
      setDeleteOpen(false);
      toast.success("Note moved to Recycle Bin");
    } catch (error) {
      setDeleteError(normalizeApiError(error).message);
    }
  }

  return (
    <>
      <article className={cn("flex min-h-72 flex-col rounded-xl border p-5 shadow-card transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md", noteBackgroundClasses[note.backgroundColor])}>
        <div className="flex items-start justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("-ml-2 -mt-2 size-9 text-muted-foreground", note.pinned && "text-primary hover:text-primary")}
            onClick={() => void handlePinned()}
            disabled={setPinned.isPending}
            aria-label={note.pinned ? "Unpin note" : "Pin note"}
            aria-pressed={note.pinned}
            title={note.pinned ? "Unpin note" : "Pin note"}
          >
            {setPinned.isPending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Pin className={cn(note.pinned && "fill-current")} aria-hidden="true" />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("-mr-2 -mt-2 size-9 text-muted-foreground", note.favorite && "text-warning hover:text-warning")}
            onClick={() => void handleFavorite()}
            disabled={setFavorite.isPending}
            aria-label={note.favorite ? "Remove note from favorites" : "Add note to favorites"}
            aria-pressed={note.favorite}
            title={note.favorite ? "Remove from favorites" : "Add to favorites"}
          >
            {setFavorite.isPending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Star className={cn(note.favorite && "fill-current")} aria-hidden="true" />}
          </Button>
        </div>

        <Link href={`/notes/${note.id}`} className="group mt-3 min-h-0 flex-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background" aria-label={`Open ${note.title}`}>
          <h2 className="line-clamp-2 text-base font-semibold tracking-tight transition-colors group-hover:text-primary">{note.title}</h2>
          <p className="mt-3 line-clamp-6 text-sm leading-6 text-muted-foreground">{note.plainText || "No text in this note yet."}</p>
        </Link>

        <footer className="mt-5 flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
          <span className={cn("size-2.5 shrink-0 rounded-full", categoryDotClass)} aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate text-foreground/80">{note.category?.name ?? "Uncategorized"}</span>
          <time dateTime={note.updatedAt} className="shrink-0">Updated {formatNoteUpdatedAt(note.updatedAt)}</time>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="-mr-2 size-8 shrink-0" aria-label={`More actions for ${note.title}`}>
                <MoreHorizontal aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onSelect={() => router.push(`/notes/${note.id}`)}><ExternalLink aria-hidden="true" />Open note</DropdownMenuItem>
              <DropdownMenuItem disabled={setPinned.isPending} onSelect={() => void handlePinned()}><Pin className={cn(note.pinned && "fill-current text-primary")} aria-hidden="true" />{note.pinned ? "Unpin note" : "Pin note"}</DropdownMenuItem>
              <DropdownMenuItem disabled={setFavorite.isPending} onSelect={() => void handleFavorite()}><Star className={cn(note.favorite && "fill-current text-warning")} aria-hidden="true" />{note.favorite ? "Remove favorite" : "Add to favorites"}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => setDeleteOpen(true)}><Trash2 aria-hidden="true" />Move to Recycle Bin</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </footer>
      </article>

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
