import { get, patch, post, put, remove } from "@/lib/api";
import type { Note, NotePayload, NotesPage, NotesSearchFilters, NoteVersion, NoteVersionSummary } from "@/features/notes/types/note.types";

export function createNote(payload: NotePayload) {
  return post<Note, NotePayload>("/api/notes", payload);
}

export function getNote(noteId: number) {
  return get<Note>(`/api/notes/${noteId}`);
}

export function updateNote(noteId: number, payload: NotePayload) {
  return put<Note, NotePayload>(`/api/notes/${noteId}`, payload);
}

export function deleteNote(noteId: number) {
  return remove<null>(`/api/notes/${noteId}`);
}

export function pinNote(noteId: number) {
  return patch<Note>(`/api/notes/${noteId}/pin`);
}

export function unpinNote(noteId: number) {
  return patch<Note>(`/api/notes/${noteId}/unpin`);
}

export function favoriteNote(noteId: number) {
  return patch<Note>(`/api/notes/${noteId}/favorite`);
}

export function unfavoriteNote(noteId: number) {
  return patch<Note>(`/api/notes/${noteId}/unfavorite`);
}

export function getNotes() {
  return get<Note[]>("/api/notes");
}

export function getPinnedNotes() {
  return get<Note[]>("/api/notes/pinned");
}

export function getFavoriteNotes() {
  return get<Note[]>("/api/notes/favorites");
}

export function getTrashedNotes() {
  return get<Note[]>("/api/notes/trash");
}

export function getTrashedNote(noteId: number) {
  return get<Note>(`/api/notes/trash/${noteId}`);
}

export function restoreNote(noteId: number) {
  return patch<Note>(`/api/notes/${noteId}/restore`);
}

export function permanentlyDeleteNote(noteId: number) {
  return remove<null>(`/api/notes/${noteId}/permanent`);
}

export function emptyTrash() {
  return remove<number>("/api/notes/trash");
}

export function getNoteVersions(noteId: number) {
  return get<NoteVersionSummary[]>(`/api/notes/${noteId}/versions`);
}

export function getNoteVersion(noteId: number, versionId: number) {
  return get<NoteVersion>(`/api/notes/${noteId}/versions/${versionId}`);
}

export function restoreNoteVersion(noteId: number, versionId: number) {
  return post<Note>(`/api/notes/${noteId}/versions/${versionId}/restore`);
}

export function searchNotes(filters: NotesSearchFilters) {
  return get<NotesPage>("/api/notes/search", {
    params: {
      query: filters.query || undefined,
      categoryId: filters.categoryId,
      uncategorized: filters.uncategorized || undefined,
      backgroundColor: filters.backgroundColor,
      pinned: filters.pinned,
      favorite: filters.favorite,
      sort: filters.sort,
      page: filters.page,
      size: filters.size,
    },
  });
}
