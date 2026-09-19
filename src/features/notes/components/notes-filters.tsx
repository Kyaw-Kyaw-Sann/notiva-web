"use client";

import { Filter, RotateCcw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [draftCategoryId, setDraftCategoryId] = useState<number | undefined>(filters.categoryId);
  const [draftBackgroundColor, setDraftBackgroundColor] = useState<NoteBackgroundColor | undefined>(filters.backgroundColor);
  const filterCount = Number(Boolean(filters.categoryId || filters.uncategorized)) + Number(Boolean(filters.backgroundColor));

  function openMobileFilters() {
    setDraftCategoryId(filters.categoryId);
    setDraftBackgroundColor(filters.backgroundColor);
    setMobileOpen(true);
  }

  function applyMobileFilters() {
    onChange({
      categoryId: draftCategoryId,
      uncategorized: undefined,
      backgroundColor: draftBackgroundColor,
    });
    setMobileOpen(false);
  }

  return (
    <>
      <Button type="button" variant="outline" className="h-11 flex-1 gap-2 bg-background px-3 sm:hidden" onClick={openMobileFilters} aria-label={filterCount ? `Filter notes, ${filterCount} active` : "Filter notes"}>
        <Filter aria-hidden="true" />
        <span>Filter</span>
        {filterCount > 0 && <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">{filterCount}</span>}
      </Button>

      <div className="hidden sm:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 gap-2 bg-background px-3" aria-label={filterCount ? `Filter notes, ${filterCount} active` : "Filter notes"}>
              <Filter aria-hidden="true" />
              <span>Filter</span>
              {filterCount > 0 && <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">{filterCount}</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 space-y-4 p-4">
            <FilterFields
              backgroundColor={filters.backgroundColor}
              categories={categories}
              categoriesLoading={categoriesLoading}
              categoryId={filters.categoryId}
              onBackgroundColorChange={(backgroundColor) => onChange({ backgroundColor })}
              onCategoryChange={(categoryId) => onChange({ categoryId, uncategorized: undefined })}
            />
            {filterCount > 0 && (
              <Button variant="ghost" size="sm" className="w-full" onClick={() => onChange({ backgroundColor: undefined, categoryId: undefined, uncategorized: undefined })}>
                <RotateCcw aria-hidden="true" />
                Clear filters
              </Button>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent className="bottom-0 left-0 top-auto w-full max-w-none translate-x-0 translate-y-0 rounded-b-none rounded-t-2xl border-x-0 border-b-0 px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5">
          <DialogHeader className="pr-10">
            <DialogTitle>Filter notes</DialogTitle>
            <DialogDescription>Choose filters, then apply them to your notes.</DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <FilterFields
              backgroundColor={draftBackgroundColor}
              categories={categories}
              categoriesLoading={categoriesLoading}
              categoryId={draftCategoryId}
              onBackgroundColorChange={setDraftBackgroundColor}
              onCategoryChange={setDraftCategoryId}
            />
          </div>
          <DialogFooter className="grid grid-cols-2">
            <Button type="button" variant="outline" onClick={() => { setDraftCategoryId(undefined); setDraftBackgroundColor(undefined); }}>
              Clear
            </Button>
            <Button type="button" onClick={applyMobileFilters}>Apply filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

type FilterFieldsProps = {
  backgroundColor?: NoteBackgroundColor;
  categories?: Category[];
  categoriesLoading: boolean;
  categoryId?: number;
  onBackgroundColorChange: (value: NoteBackgroundColor | undefined) => void;
  onCategoryChange: (value: number | undefined) => void;
};

function FilterFields({ backgroundColor, categories, categoriesLoading, categoryId, onBackgroundColorChange, onCategoryChange }: FilterFieldsProps) {
  return (
    <div className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">Category</span>
        <select
          className={`${selectClassName} w-full`}
          value={categoryId ?? ""}
          disabled={categoriesLoading}
          onChange={(event) => onCategoryChange(event.target.value ? Number(event.target.value) : undefined)}
        >
          <option value="">All categories</option>
          {categories?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
      </label>
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">Background color</span>
        <select className={`${selectClassName} w-full`} value={backgroundColor ?? ""} onChange={(event) => onBackgroundColorChange((event.target.value || undefined) as NoteBackgroundColor | undefined)}>
          <option value="">All colors</option>
          {backgroundColorOptions.map((color) => <option key={color.value} value={color.value}>{color.label}</option>)}
        </select>
      </label>
    </div>
  );
}
