import { get, post, put, remove } from "@/lib/api";
import type { NotesPage } from "@/features/notes/types/note.types";
import type { Category, CategoryPayload } from "@/features/categories/types/category.types";

export function getCategories() {
  return get<Category[]>("/api/categories");
}

export function createCategory(payload: CategoryPayload) {
  return post<Category, CategoryPayload>("/api/categories", payload);
}

export function updateCategory(categoryId: number, payload: CategoryPayload) {
  return put<Category, CategoryPayload>(`/api/categories/${categoryId}`, payload);
}

export function deleteCategory(categoryId: number) {
  return remove<null>(`/api/categories/${categoryId}`);
}

export function getCategoryNoteCount(categoryId?: number) {
  return get<NotesPage>("/api/notes/search", {
    params: {
      ...(categoryId ? { categoryId } : { uncategorized: true }),
      page: 0,
      size: 1,
      sort: "UPDATED_DESC",
    },
  });
}
