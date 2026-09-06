"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { NotesPage } from "@/features/notes/types/note.types";

type NotesPaginationProps = {
  onPageChange: (page: number) => void;
  page: NotesPage;
};

export function NotesPagination({ onPageChange, page }: NotesPaginationProps) {
  if (page.totalPages <= 1) return null;

  const firstResult = page.page * page.size + 1;
  const lastResult = Math.min((page.page + 1) * page.size, page.totalElements);

  return (
    <nav className="mt-8 grid gap-4 border-t pt-5 sm:grid-cols-3 sm:items-center" aria-label="Notes pagination">
      <p className="text-sm text-muted-foreground">{firstResult}-{lastResult} of {page.totalElements} notes</p>
      <div className="flex items-center gap-2 sm:justify-center">
        <Button variant="outline" size="icon" onClick={() => onPageChange(page.page - 1)} disabled={page.first} aria-label="Previous page">
          <ChevronLeft aria-hidden="true" />
        </Button>
        <span className="flex h-10 min-w-10 items-center justify-center rounded-md border border-primary bg-primary/10 px-3 text-sm font-medium text-primary" aria-current="page">{page.page + 1}</span>
        <span className="text-sm text-muted-foreground">of {page.totalPages}</span>
        <Button variant="outline" size="icon" onClick={() => onPageChange(page.page + 1)} disabled={page.last} aria-label="Next page">
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
      <div className="hidden sm:block" aria-hidden="true" />
    </nav>
  );
}
