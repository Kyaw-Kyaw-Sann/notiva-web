"use client";

import { useQuery } from "@tanstack/react-query";

import { getNoteCategories, getTrashedNotes, searchNotes } from "@/features/notes/api/notes-api";
import type { NotesPage, NotesSearchFilters, NotesView } from "@/features/notes/types/note.types";

const notesQueryKeys = {
  categories: ["categories"] as const,
  search: (filters: NotesSearchFilters) => ["notes", "search", filters] as const,
  trash: ["notes", "trash"] as const,
};

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

export function useNoteCategories(enabled = true) {
  return useQuery({
    queryKey: notesQueryKeys.categories,
    queryFn: getNoteCategories,
    enabled,
  });
}
