"use client";

import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";

import { createCategory, deleteCategory, getCategories, getCategoryNoteCount, updateCategory } from "@/features/categories/api/categories-api";
import type { Category, CategoryPayload } from "@/features/categories/types/category.types";

export const categoryQueryKeys = {
  all: ["categories"] as const,
  count: (categoryId?: number) => ["categories", "count", categoryId ?? "uncategorized"] as const,
};

function invalidateCategoryRelatedData(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all }),
    queryClient.invalidateQueries({ queryKey: ["notes"] }),
  ]);
}

export function useCategories(enabled = true) {
  return useQuery({
    queryKey: categoryQueryKeys.all,
    queryFn: getCategories,
    enabled,
  });
}

export function useCategoryNoteCounts(categories: Category[]) {
  const categoryQueries = useQueries({
    queries: categories.map((category) => ({
      queryKey: categoryQueryKeys.count(category.id),
      queryFn: () => getCategoryNoteCount(category.id),
      select: (page: Awaited<ReturnType<typeof getCategoryNoteCount>>) => page.totalElements,
    })),
  });
  const uncategorizedQuery = useQuery({
    queryKey: categoryQueryKeys.count(),
    queryFn: () => getCategoryNoteCount(),
    select: (page) => page.totalElements,
  });

  return {
    categoryCounts: new Map(categories.map((category, index) => [category.id, categoryQueries[index]?.data])),
    countsLoading: categoryQueries.some((query) => query.isLoading) || uncategorizedQuery.isLoading,
    uncategorizedCount: uncategorizedQuery.data,
  };
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CategoryPayload) => createCategory(payload),
    onSuccess: () => invalidateCategoryRelatedData(queryClient),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, payload }: { categoryId: number; payload: CategoryPayload }) => updateCategory(categoryId, payload),
    onSuccess: () => invalidateCategoryRelatedData(queryClient),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => invalidateCategoryRelatedData(queryClient),
  });
}
