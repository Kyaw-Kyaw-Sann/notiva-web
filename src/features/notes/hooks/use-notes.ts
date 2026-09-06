"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { categoryQueryKeys } from "@/features/categories/hooks/use-categories";
import { createNote, deleteNote, emptyTrash, favoriteNote, getNote, getNoteVersion, getNoteVersions, getTrashedNote, getTrashedNotes, permanentlyDeleteNote, pinNote, restoreNote, restoreNoteVersion, searchNotes, unfavoriteNote, unpinNote, updateNote } from "@/features/notes/api/notes-api";
import type { NotePayload, NotesPage, NotesSearchFilters, NotesView } from "@/features/notes/types/note.types";

export const notesQueryKeys = {
  detail: (noteId: number) => ["notes", "detail", noteId] as const,
  trashDetail: (noteId: number) => ["notes", "trash-detail", noteId] as const,
  search: (filters: NotesSearchFilters) => ["notes", "search", filters] as const,
  searchRoot: ["notes", "search"] as const,
  trash: ["notes", "trash"] as const,
  versions: (noteId: number) => ["notes", "versions", noteId] as const,
  version: (noteId: number, versionId: number) => ["notes", "versions", noteId, versionId] as const,
};

type NoteInvalidationOptions = {
  categoryCounts?: boolean;
  trash?: boolean;
};

function invalidateNoteLists(queryClient: ReturnType<typeof useQueryClient>, options: NoteInvalidationOptions = {}) {
  const invalidations = [queryClient.invalidateQueries({ queryKey: notesQueryKeys.searchRoot })];

  if (options.trash) {
    invalidations.push(queryClient.invalidateQueries({ queryKey: notesQueryKeys.trash }));
  }

  if (options.categoryCounts) {
    invalidations.push(queryClient.invalidateQueries({ queryKey: [...categoryQueryKeys.all, "count"] }));
  }

  return Promise.all(invalidations);
}

function toTrashPage(notes: Awaited<ReturnType<typeof getTrashedNotes>>): NotesPage {
  return {
    content: notes,
    first: true,
    last: true,
    page: 0,
    size: notes.length,
    totalElements: notes.length,
    totalPages: notes.length > 0 ? 1 : 0,
  };
}

export function useNotes(view: NotesView, filters: NotesSearchFilters) {
  return useQuery({
    queryKey: view === "trash" ? notesQueryKeys.trash : notesQueryKeys.search(filters),
    queryFn: async () => view === "trash" ? toTrashPage(await getTrashedNotes()) : searchNotes(filters),
  });
}

export function useNote(noteId: number) {
  return useQuery({
    queryKey: notesQueryKeys.detail(noteId),
    queryFn: () => getNote(noteId),
    enabled: Number.isSafeInteger(noteId) && noteId > 0,
  });
}

export function useTrashedNote(noteId: number, enabled = true) {
  return useQuery({
    queryKey: notesQueryKeys.trashDetail(noteId),
    queryFn: () => getTrashedNote(noteId),
    enabled: enabled && Number.isSafeInteger(noteId) && noteId > 0,
  });
}

export function useNoteVersions(noteId: number, enabled = true) {
  return useQuery({
    queryKey: notesQueryKeys.versions(noteId),
    queryFn: () => getNoteVersions(noteId),
    enabled: enabled && Number.isSafeInteger(noteId) && noteId > 0,
  });
}

export function useNoteVersion(noteId: number, versionId: number | null) {
  return useQuery({
    queryKey: notesQueryKeys.version(noteId, versionId ?? 0),
    queryFn: () => getNoteVersion(noteId, versionId ?? 0),
    enabled: versionId !== null && Number.isSafeInteger(noteId) && noteId > 0,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNote,
    onSuccess: (note) => {
      queryClient.setQueryData(notesQueryKeys.detail(note.id), note);
      return invalidateNoteLists(queryClient, { categoryCounts: true });
    },
  });
}

export function useUpdateNote(noteId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: NotePayload) => updateNote(noteId, payload),
    onSuccess: (note) => {
      queryClient.setQueryData(notesQueryKeys.detail(note.id), note);
      return invalidateNoteLists(queryClient, { categoryCounts: true });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNote,
    onSuccess: (_, noteId) => {
      queryClient.removeQueries({ queryKey: notesQueryKeys.detail(noteId) });
      return invalidateNoteLists(queryClient, { categoryCounts: true, trash: true });
    },
  });
}

export function useRestoreNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreNote,
    onSuccess: (note) => {
      queryClient.setQueryData(notesQueryKeys.detail(note.id), note);
      queryClient.removeQueries({ queryKey: notesQueryKeys.trashDetail(note.id) });
      return invalidateNoteLists(queryClient, { categoryCounts: true, trash: true });
    },
  });
}

export function usePermanentlyDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: permanentlyDeleteNote,
    onSuccess: (_, noteId) => {
      queryClient.removeQueries({ queryKey: notesQueryKeys.detail(noteId) });
      queryClient.removeQueries({ queryKey: notesQueryKeys.trashDetail(noteId) });
      queryClient.removeQueries({ queryKey: notesQueryKeys.versions(noteId) });
      return invalidateNoteLists(queryClient, { categoryCounts: true, trash: true });
    },
  });
}

export function useEmptyTrash() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: emptyTrash,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["notes", "trash-detail"] });
      queryClient.removeQueries({ queryKey: ["notes", "versions"] });
      return invalidateNoteLists(queryClient, { categoryCounts: true, trash: true });
    },
  });
}

export function useRestoreNoteVersion(noteId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (versionId: number) => restoreNoteVersion(noteId, versionId),
    onSuccess: (note) => {
      queryClient.setQueryData(notesQueryKeys.detail(noteId), note);
      void queryClient.invalidateQueries({ queryKey: notesQueryKeys.versions(noteId) });
      return invalidateNoteLists(queryClient, { categoryCounts: true });
    },
  });
}

export function useSetNotePinned(noteId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pinned: boolean) => pinned ? pinNote(noteId) : unpinNote(noteId),
    onSuccess: (note) => {
      queryClient.setQueryData(notesQueryKeys.detail(noteId), note);
      return invalidateNoteLists(queryClient);
    },
  });
}

export function useSetNoteFavorite(noteId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (favorite: boolean) => favorite ? favoriteNote(noteId) : unfavoriteNote(noteId),
    onSuccess: (note) => {
      queryClient.setQueryData(notesQueryKeys.detail(noteId), note);
      return invalidateNoteLists(queryClient);
    },
  });
}
