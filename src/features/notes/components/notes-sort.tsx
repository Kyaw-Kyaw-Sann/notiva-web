"use client";

import { ArrowDownUp, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { NoteSort } from "@/features/notes/types/note.types";
import { noteSortOptions } from "@/features/notes/utils/notes-search-params";

type NotesSortProps = {
  onSortChange: (sort: NoteSort) => void;
  sort: NoteSort;
};

export function NotesSort({ onSortChange, sort }: NotesSortProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10 gap-2 bg-background px-3">
          <ArrowDownUp aria-hidden="true" />
          Sort
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {noteSortOptions.map((option) => (
          <DropdownMenuItem key={option.value} onSelect={() => onSortChange(option.value)} className="justify-between gap-3">
            {option.label}
            {sort === option.value && <Check className="size-4 text-primary" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
