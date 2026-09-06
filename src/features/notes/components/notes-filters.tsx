"use client";

import { Filter, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Category } from "@/features/categories/types/category.types";
import type { NoteBackgroundColor, NotesSearchFilters } from "@/features/notes/types/note.types";

type NotesFiltersProps = {
  categories?: Category[];
  categoriesLoading: boolean;
  filters: NotesSearchFilters;
  onChange: (changes: Partial<NotesSearchFilters>) => void;
};

const backgroundColorOptions: { label: string; value: NoteBackgroundColor }[] = [
  { label: "Default", value: "DEFAULT" },
  { label: "Yellow", value: "YELLOW" },
  { label: "Green", value: "GREEN" },
  { label: "Blue", value: "BLUE" },
  { label: "Pink", value: "PINK" },
  { label: "Purple", value: "PURPLE" },
  { label: "Gray", value: "GRAY" },
];

const selectClassName = "h-10 rounded-lg border bg-surface px-3 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60";

export function NotesFilters({ categories, categoriesLoading, filters, onChange }: NotesFiltersProps) {
  const filterCount = Number(Boolean(filters.categoryId)) + Number(Boolean(filters.backgroundColor));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10 gap-2 bg-background px-3" aria-label={filterCount ? `Filter notes, ${filterCount} active` : "Filter notes"}>
          <Filter aria-hidden="true" />
          <span>Filter</span>
          {filterCount > 0 && <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">{filterCount}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 space-y-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">Filter notes</p>
          {filterCount > 0 && (
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => onChange({ backgroundColor: undefined, categoryId: undefined })}>
              <RotateCcw aria-hidden="true" />
              Clear
            </Button>
          )}
        </div>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Category</span>
          <select
            className={`${selectClassName} w-full`}
            value={filters.categoryId ?? ""}
            disabled={categoriesLoading}
            onChange={(event) => onChange({ categoryId: event.target.value ? Number(event.target.value) : undefined, uncategorized: undefined })}
          >
            <option value="">All categories</option>
            {categories?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Background color</span>
          <select className={`${selectClassName} w-full`} value={filters.backgroundColor ?? ""} onChange={(event) => onChange({ backgroundColor: (event.target.value || undefined) as NoteBackgroundColor | undefined })}>
            <option value="">All colors</option>
            {backgroundColorOptions.map((color) => <option key={color.value} value={color.value}>{color.label}</option>)}
          </select>
        </label>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
