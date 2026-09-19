"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Category } from "@/features/categories/types/category.types";
import type { NotesSearchFilters } from "@/features/notes/types/note.types";

type NotesActiveFiltersProps = {
  categories?: Category[];
  filters: NotesSearchFilters;
  onChange: (changes: Partial<NotesSearchFilters>) => void;
};

export function NotesActiveFilters({ categories, filters, onChange }: NotesActiveFiltersProps) {
  const category = categories?.find((item) => item.id === filters.categoryId);
  const chips = [
    category ? { key: "category", label: category.name, clear: () => onChange({ categoryId: undefined }) } : null,
    filters.uncategorized ? { key: "uncategorized", label: "Uncategorized", clear: () => onChange({ uncategorized: undefined }) } : null,
    filters.backgroundColor ? { key: "color", label: `${toTitleCase(filters.backgroundColor)} notes`, clear: () => onChange({ backgroundColor: undefined }) } : null,
  ].filter((chip): chip is NonNullable<typeof chip> => chip !== null);

  if (chips.length === 0) return null;

  return (
    <div className="notiva-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" aria-label="Active note filters">
      {chips.map((chip) => (
        <Button
          key={chip.key}
          type="button"
          variant="secondary"
          size="sm"
          className="h-8 shrink-0 rounded-full px-3 text-xs"
          onClick={chip.clear}
          aria-label={`Remove ${chip.label} filter`}
        >
          {chip.label}
          <X className="size-3.5" aria-hidden="true" />
        </Button>
      ))}
      {chips.length > 1 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 shrink-0 rounded-full px-3 text-xs text-muted-foreground"
          onClick={() => onChange({ backgroundColor: undefined, categoryId: undefined, uncategorized: undefined })}
        >
          Clear all
        </Button>
      )}
    </div>
  );
}

function toTitleCase(value: string) {
  return value.charAt(0) + value.slice(1).toLocaleLowerCase();
}
