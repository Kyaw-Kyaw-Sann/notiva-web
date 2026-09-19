"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { NotesPage } from "@/features/notes/types/note.types";
import { cn } from "@/lib/utils";

type NotesPaginationProps = {
  onPageChange: (page: number) => void;
  page: NotesPage;
};

type PaginationItem = number | "ellipsis-left" | "ellipsis-right";

function getPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index);
  }

  const visiblePages = Array.from(new Set([0, totalPages - 1, currentPage - 1, currentPage, currentPage + 1]))
    .filter((item) => item >= 0 && item < totalPages)
    .sort((a, b) => a - b);
  const items: PaginationItem[] = [];

  visiblePages.forEach((visiblePage, index) => {
    const previousPage = visiblePages[index - 1];

    if (index > 0 && visiblePage - previousPage > 1) {
      items.push(index === 1 ? "ellipsis-left" : "ellipsis-right");
    }

    items.push(visiblePage);
  });

  return items;
}

export function NotesPagination({ onPageChange, page }: NotesPaginationProps) {
  if (page.totalPages <= 1) return null;

  const firstResult = page.page * page.size + 1;
  const lastResult = Math.min((page.page + 1) * page.size, page.totalElements);
  const paginationItems = getPaginationItems(page.page, page.totalPages);

  return (
    <nav className="mt-8 border-t pt-5" aria-label="Notes pagination">
      <div className="flex items-center justify-between gap-3 sm:hidden">
        <Button variant="outline" size="icon" className="size-11" onClick={() => onPageChange(page.page - 1)} disabled={page.first} aria-label="Previous page">
          <ChevronLeft aria-hidden="true" />
        </Button>
        <span className="text-center text-sm font-medium text-foreground">Page {page.page + 1}<span className="text-muted-foreground"> of {page.totalPages}</span></span>
        <Button variant="outline" size="icon" className="size-11" onClick={() => onPageChange(page.page + 1)} disabled={page.last} aria-label="Next page">
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>

      <div className="hidden grid-cols-[1fr_auto_1fr] items-center gap-4 sm:grid">
        <p className="text-sm text-muted-foreground">{firstResult}-{lastResult} of {page.totalElements} notes</p>
        <div className="flex items-center justify-center gap-1.5">
          <Button variant="outline" size="icon" className="size-9" onClick={() => onPageChange(page.page - 1)} disabled={page.first} aria-label="Previous page">
            <ChevronLeft aria-hidden="true" />
          </Button>
          {paginationItems.map((item) => typeof item === "number" ? (
            <Button
              key={item}
              type="button"
              variant="outline"
              size="icon"
              className={cn("size-9 border-transparent bg-transparent shadow-none", item === page.page && "border-primary bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary")}
              onClick={() => onPageChange(item)}
              aria-label={`Go to page ${item + 1}`}
              aria-current={item === page.page ? "page" : undefined}
            >
              {item + 1}
            </Button>
          ) : (
            <span key={item} className="flex size-9 items-center justify-center text-sm text-muted-foreground" aria-hidden="true">...</span>
          ))}
          <Button variant="outline" size="icon" className="size-9" onClick={() => onPageChange(page.page + 1)} disabled={page.last} aria-label="Next page">
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
        <p className="text-right text-sm text-muted-foreground">Page {page.page + 1} of {page.totalPages}</p>
      </div>
    </nav>
  );
}
