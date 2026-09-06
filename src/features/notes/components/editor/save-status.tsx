"use client";

import { AlertCircle, Check, Circle, LoaderCircle, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { NoteAutosaveStatus } from "@/features/notes/hooks/use-note-autosave";
import type { AppApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

type SaveStatusProps = {
  error: AppApiError | null;
  hasUnsavedChanges: boolean;
  onRetry: () => void;
  status: NoteAutosaveStatus;
};

export function SaveStatus({ error, hasUnsavedChanges, onRetry, status }: SaveStatusProps) {
  if (status === "saving") {
    return <span className="flex items-center gap-1.5 px-2 text-xs text-muted-foreground" aria-live="polite"><LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />Saving…</span>;
  }

  if (status === "error") {
    return (
      <div className="flex items-center gap-1" role="status" aria-live="polite">
        <span className="flex items-center gap-1.5 px-2 text-xs text-destructive" title={error?.message}><AlertCircle className="size-3.5" aria-hidden="true" />Save failed</span>
        <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={onRetry}><RotateCw aria-hidden="true" />Retry</Button>
      </div>
    );
  }

  if (hasUnsavedChanges) {
    return <span className="flex items-center gap-1.5 px-2 text-xs text-warning" aria-live="polite"><Circle className="size-2 fill-current" aria-hidden="true" />Unsaved changes</span>;
  }

  return <span className={cn("flex items-center gap-1.5 px-2 text-xs", status === "idle" ? "text-muted-foreground" : "text-success")} aria-live="polite"><Check className="size-3.5" aria-hidden="true" />Saved</span>;
}
