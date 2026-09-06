"use client";

import { LayoutGrid, List, NotebookText, Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { Button } from "@/components/ui/button";
import { NotesDashboardSkeleton } from "@/features/notes/components/notes-dashboard-skeleton";
import { NotesFilters } from "@/features/notes/components/notes-filters";
import { NotesGrid } from "@/features/notes/components/notes-grid";
import { NotesList } from "@/features/notes/components/notes-list";
import { NotesPagination } from "@/features/notes/components/notes-pagination";
import { NotesSearch } from "@/features/notes/components/notes-search";
import { NotesSort } from "@/features/notes/components/notes-sort";
import { EmptyTrashDialog } from "@/features/notes/components/trash/empty-trash-dialog";
import { TrashNotes } from "@/features/notes/components/trash/trash-notes";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { useNotes } from "@/features/notes/hooks/use-notes";
import type { NotesSearchFilters, NotesView } from "@/features/notes/types/note.types";
import { getNotesSearchFilters, setNotesSearchFilter } from "@/features/notes/utils/notes-search-params";
import { normalizeApiError } from "@/lib/api";

type NotesDashboardProps = {
  view: NotesView;
};

const viewContent: Record<NotesView, { emptyDescription: string; emptyTitle: string; title: string }> = {
  all: { title: "All Notes", emptyTitle: "No notes yet", emptyDescription: "Your notes will appear here when you create them." },
  pinned: { title: "Pinned", emptyTitle: "No pinned notes", emptyDescription: "Pin important notes to find them quickly." },
  favorites: { title: "Favorites", emptyTitle: "No favorite notes", emptyDescription: "Mark notes as favorites to keep them close." },
  trash: { title: "Recycle Bin", emptyTitle: "Recycle bin is empty", emptyDescription: "Deleted notes will appear here until they are permanently removed." },
};

export function NotesDashboard({ view }: NotesDashboardProps) {
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(() => getNotesSearchFilters(new URLSearchParams(searchParams.toString())), [searchParams]);
  const { data: categories, isLoading: categoriesLoading } = useCategories(view !== "trash");
  const { data: notesPage, error, isError, isLoading, refetch } = useNotes(view, filters);
  const sidebarView = view === "all" && filters.pinned === true && filters.favorite !== true
    ? "pinned"
    : view === "all" && filters.favorite === true && filters.pinned !== true
      ? "favorites"
      : view;
  const content = viewContent[sidebarView];
  const hasSearchFilters = Boolean(filters.query || filters.categoryId || filters.uncategorized || filters.backgroundColor);

  const updateFilters = useCallback((changes: Partial<NotesSearchFilters>, options?: { replace?: boolean; resetPage?: boolean }) => {
    let nextParams = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(changes) as [keyof NotesSearchFilters, NotesSearchFilters[keyof NotesSearchFilters]][]) {
      nextParams = setNotesSearchFilter(nextParams, key, value);
    }

    if (options?.resetPage ?? true) {
      nextParams.delete("page");
    }

    const query = nextParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    (options?.replace ? router.replace : router.push)(url);
  }, [pathname, router, searchParams]);

  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{content.title}</h1>
          {notesPage && !isLoading && <span className="rounded-lg bg-surface-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">{notesPage.totalElements} notes</span>}
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center xl:w-auto">
          {view !== "trash" && (
            <>
            <NotesSearch value={filters.query ?? ""} onChange={(query) => updateFilters({ query: query || undefined }, { replace: true })} />
              <div className="flex items-center gap-2">
                <NotesFilters categories={categories} categoriesLoading={categoriesLoading} filters={filters} onChange={(changes) => updateFilters(changes)} />
                <NotesSort sort={filters.sort} onSortChange={(sort) => updateFilters({ sort })} />
              </div>
            </>
          )}
          {view === "trash" && <EmptyTrashDialog disabled={!notesPage || notesPage.totalElements === 0 || isLoading || isError} />}
          <div className="inline-flex w-fit rounded-lg border bg-surface p-1" role="group" aria-label="Notes layout">
            <Button variant={layout === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setLayout("grid")} aria-label="Grid view" aria-pressed={layout === "grid"}>
              <LayoutGrid aria-hidden="true" />
            </Button>
            <Button variant={layout === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setLayout("list")} aria-label="List view" aria-pressed={layout === "list"}>
              <List aria-hidden="true" />
            </Button>
          </div>
          <Button asChild className="w-fit">
            <Link href="/notes/new"><Plus aria-hidden="true" />New Note</Link>
          </Button>
        </div>
      </div>

      {isLoading && <NotesDashboardSkeleton />}
      {isError && (
        <ErrorState
          title="Could not load notes"
          description={normalizeApiError(error).message}
          action={<Button onClick={() => void refetch()}>Try again</Button>}
        />
      )}
      {!isLoading && !isError && notesPage?.content.length === 0 && <EmptyState icon={NotebookText} title={hasSearchFilters ? "No matching notes" : content.emptyTitle} description={hasSearchFilters ? "Try changing or clearing one of your search filters." : content.emptyDescription} />}
      {!isLoading && !isError && notesPage && notesPage.content.length > 0 && (
        <>
          {view === "trash"
            ? <TrashNotes layout={layout} notes={notesPage.content} />
            : layout === "grid"
              ? <NotesGrid notes={notesPage.content} />
              : <NotesList notes={notesPage.content} />}
          {view !== "trash" && <NotesPagination page={notesPage} onPageChange={(page) => updateFilters({ page }, { resetPage: false })} />}
        </>
      )}
    </section>
  );
}
