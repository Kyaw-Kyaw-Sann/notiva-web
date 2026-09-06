"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { updateNote } from "@/features/notes/api/notes-api";
import { categoryQueryKeys } from "@/features/categories/hooks/use-categories";
import { notesQueryKeys } from "@/features/notes/hooks/use-notes";
import type { Note, NotePayload } from "@/features/notes/types/note.types";
import { normalizeApiError, type AppApiError } from "@/lib/api";

const DEFAULT_AUTOSAVE_DELAY = 800;

export type NoteAutosaveStatus = "idle" | "saving" | "saved" | "error";

type UseNoteAutosaveOptions = {
  enabled: boolean;
  isDirty: boolean;
  noteId: number;
  onSaved: (payload: NotePayload) => void;
  payload: NotePayload;
};

type SaveRequest = {
  payload: NotePayload;
  revision: number;
};

export function useNoteAutosave({ enabled, isDirty, noteId, onSaved, payload }: UseNoteAutosaveOptions) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<AppApiError | null>(null);
  const [status, setStatus] = useState<NoteAutosaveStatus>("saved");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const payloadRef = useRef(payload);
  const revisionRef = useRef(0);
  const onSavedRef = useRef(onSaved);
  const payloadKey = useMemo(() => JSON.stringify(payload), [payload]);

  const { mutateAsync } = useMutation({
    mutationFn: ({ payload: requestPayload }: SaveRequest) => updateNote(noteId, requestPayload),
  });

  useEffect(() => {
    payloadRef.current = JSON.parse(payloadKey) as NotePayload;
    onSavedRef.current = onSaved;
    revisionRef.current += 1;
  }, [onSaved, payloadKey]);

  const clearScheduledSave = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const save = useCallback(async (revision: number) => {
    if (!enabled) {
      return;
    }

    const requestPayload = payloadRef.current;
    setStatus("saving");
    setError(null);

    try {
      const savedNote = await mutateAsync({ payload: requestPayload, revision });

      // A response for an earlier edit must never replace a newer local draft.
      if (revision !== revisionRef.current) {
        return;
      }

      queryClient.setQueryData<Note>(notesQueryKeys.detail(noteId), savedNote);
      void queryClient.invalidateQueries({ queryKey: notesQueryKeys.searchRoot });
      void queryClient.invalidateQueries({ queryKey: [...categoryQueryKeys.all, "count"] });
      onSavedRef.current(requestPayload);
      setStatus("saved");
    } catch (saveError) {
      // Ignore an older failed request once the user has made a newer change.
      if (revision !== revisionRef.current) {
        return;
      }

      setError(normalizeApiError(saveError));
      setStatus("error");
    }
  }, [enabled, mutateAsync, noteId, queryClient]);

  useEffect(() => {
    clearScheduledSave();

    if (!enabled || !isDirty) {
      return;
    }

    const revision = revisionRef.current;
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      void save(revision);
    }, DEFAULT_AUTOSAVE_DELAY);

    return clearScheduledSave;
  }, [clearScheduledSave, enabled, isDirty, payloadKey, save]);

  useEffect(() => clearScheduledSave, [clearScheduledSave]);

  const saveNow = useCallback(() => {
    clearScheduledSave();
    return save(revisionRef.current);
  }, [clearScheduledSave, save]);

  return {
    error,
    saveNow,
    status,
  };
}

export function useUnsavedChangesWarning(hasUnsavedChanges: boolean) {
  useEffect(() => {
    if (!hasUnsavedChanges) {
      return;
    }

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    function handleInternalLink(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const destination = new URL(link.href);
      if (destination.origin !== window.location.origin || destination.href === window.location.href) {
        return;
      }

      if (!window.confirm("You have unsaved changes. Leave this note anyway?")) {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleInternalLink, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleInternalLink, true);
    };
  }, [hasUnsavedChanges]);
}
