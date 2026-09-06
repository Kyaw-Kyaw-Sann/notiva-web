import { get } from "@/lib/api";
import type { Note, NoteCategory, NotesPage, NotesSearchFilters } from "@/features/notes/types/note.types";

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

export function getNoteCategories() {
  return get<NoteCategory[]>("/api/categories");
}
