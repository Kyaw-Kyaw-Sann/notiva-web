"use client";

import { History, LoaderCircle, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NoteEditor } from "@/features/notes/components/editor/note-editor";
import { useNoteVersion, useNoteVersions, useRestoreNoteVersion } from "@/features/notes/hooks/use-notes";
import type { Note, NoteVersionSummary } from "@/features/notes/types/note.types";
import { normalizeApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

function formatVersionTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function VersionListItem({ active, onSelect, version }: { active: boolean; onSelect: () => void; version: NoteVersionSummary }) {
  return (
    <button type="button" className={cn("w-full rounded-lg border px-3 py-3 text-left transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring", active && "border-primary bg-primary/5")} onClick={onSelect} aria-pressed={active}>
      <span className="block truncate text-sm font-medium">{version.title || "Untitled note"}</span>
      <time className="mt-1 block text-xs text-muted-foreground" dateTime={version.createdAt}>{formatVersionTime(version.createdAt)}</time>
    </button>
  );
}

export function VersionHistoryDialog({ disabled, noteId, onRestored }: { disabled?: boolean; noteId: number; onRestored?: (note: Note) => void }) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const versions = useNoteVersions(noteId, open);
  const activeVersionId = selectedId ?? versions.data?.[0]?.id ?? null;
  const version = useNoteVersion(noteId, activeVersionId);
  const restoreVersion = useRestoreNoteVersion(noteId);

  async function handleRestore() {
    if (activeVersionId === null) return;

    setRestoreError(null);
    try {
      const restoredNote = await restoreVersion.mutateAsync(activeVersionId);
      onRestored?.(restoredNote);
      setConfirmOpen(false);
      setOpen(false);
      toast.success("Version restored");
    } catch (error) {
      setRestoreError(normalizeApiError(error).message);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(nextOpen) => { setOpen(nextOpen); if (!nextOpen) setSelectedId(null); }}>
        <DialogTrigger asChild>
          <Button type="button" variant="ghost" size="icon" className="size-9" disabled={disabled} aria-label="Open version history" title={disabled ? "Save changes before opening version history" : "Version history"}><History aria-hidden="true" /></Button>
        </DialogTrigger>
        <DialogContent className="notiva-scrollbar max-h-[92vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Version history</DialogTitle>
            <DialogDescription>Preview a saved version before restoring it to the current note.</DialogDescription>
          </DialogHeader>

          {versions.isLoading && <div className="flex min-h-64 items-center justify-center"><LoaderCircle className="size-6 animate-spin text-primary" aria-label="Loading version history" /></div>}
          {versions.isError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive" role="alert">
              <p>{normalizeApiError(versions.error).message}</p>
              <Button type="button" variant="outline" className="mt-4" onClick={() => void versions.refetch()}>Try again</Button>
            </div>
          )}
          {versions.data?.length === 0 && <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">No saved versions yet.</div>}
          {versions.data && versions.data.length > 0 && (
            <div className="grid gap-5 md:grid-cols-[15rem_minmax(0,1fr)]">
              <div className="notiva-scrollbar max-h-[32rem] space-y-2 overflow-y-auto pr-1" aria-label="Saved versions">
                {versions.data.map((item) => <VersionListItem key={item.id} active={item.id === activeVersionId} version={item} onSelect={() => setSelectedId(item.id)} />)}
              </div>
              <div className="min-w-0">
                {version.isLoading && <div className="flex min-h-64 items-center justify-center rounded-xl border"><LoaderCircle className="size-6 animate-spin text-primary" aria-label="Loading version preview" /></div>}
                {version.isError && <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive" role="alert">{normalizeApiError(version.error).message}</div>}
                {version.data && (
                  <>
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div><h3 className="font-semibold">{version.data.title}</h3><p className="text-xs text-muted-foreground">Saved {formatVersionTime(version.data.createdAt)}</p></div>
                      <Button type="button" onClick={() => setConfirmOpen(true)}><RotateCcw aria-hidden="true" />Restore this version</Button>
                    </div>
                    <div className="notiva-version-preview max-h-[30rem] overflow-y-auto rounded-xl border bg-surface-muted/40">
                      <NoteEditor key={version.data.id} contentJson={version.data.contentJson} fallbackPlainText={version.data.plainText} disabled showToolbar={false} onChange={() => undefined} onReadyPlainText={() => undefined} />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={(nextOpen) => { setRestoreError(null); setConfirmOpen(nextOpen); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore this saved version?</DialogTitle>
            <DialogDescription>The selected content will replace the current note content. The restored note will reload after the server confirms the change.</DialogDescription>
          </DialogHeader>
          {restoreError && <p className="mt-4 text-sm text-destructive" role="alert">{restoreError}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button type="button" disabled={restoreVersion.isPending} onClick={() => void handleRestore()}>
              {restoreVersion.isPending && <LoaderCircle className="animate-spin" aria-hidden="true" />}
              Restore version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
