import type { NoteBackgroundColor, NoteSort, NotesSearchFilters } from "@/features/notes/types/note.types";

const backgroundColors = new Set<NoteBackgroundColor>(["DEFAULT", "YELLOW", "GREEN", "BLUE", "PINK", "PURPLE", "GRAY"]);

export const noteSortOptions: { label: string; value: NoteSort }[] = [
  { label: "Last updated", value: "UPDATED_DESC" },
  { label: "Least recently updated", value: "UPDATED_ASC" },
  { label: "Newest created", value: "CREATED_DESC" },
  { label: "Oldest created", value: "CREATED_ASC" },
  { label: "Title A to Z", value: "TITLE_ASC" },
  { label: "Title Z to A", value: "TITLE_DESC" },
];

const noteSortValues = new Set<NoteSort>(noteSortOptions.map(({ value }) => value));
const defaultFilters: NotesSearchFilters = { page: 0, size: 12, sort: "UPDATED_DESC" };

function parsePositiveInteger(value: string | null, fallback: number, minimum: number, maximum: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum ? parsed : fallback;
}

export function getNotesSearchFilters(searchParams: URLSearchParams): NotesSearchFilters {
  const categoryId = parsePositiveInteger(searchParams.get("categoryId"), 0, 1, Number.MAX_SAFE_INTEGER);
  const backgroundColor = searchParams.get("backgroundColor");
  const sort = searchParams.get("sort");
  const query = searchParams.get("query")?.trim();
  const uncategorized = searchParams.get("uncategorized") === "true";
  const pinned = searchParams.get("pinned") === "true" ? true : searchParams.get("pinned") === "false" ? false : undefined;
  const favorite = searchParams.get("favorite") === "true" ? true : searchParams.get("favorite") === "false" ? false : undefined;

  return {
    ...defaultFilters,
    ...(query ? { query } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(uncategorized ? { uncategorized: true } : {}),
    ...(backgroundColor && backgroundColors.has(backgroundColor as NoteBackgroundColor) ? { backgroundColor: backgroundColor as NoteBackgroundColor } : {}),
    ...(pinned !== undefined ? { pinned } : {}),
    ...(favorite !== undefined ? { favorite } : {}),
    ...(sort && noteSortValues.has(sort as NoteSort) ? { sort: sort as NoteSort } : {}),
    page: parsePositiveInteger(searchParams.get("page"), defaultFilters.page, 0, Number.MAX_SAFE_INTEGER),
    size: parsePositiveInteger(searchParams.get("size"), defaultFilters.size, 1, 50),
  };
}

export function setNotesSearchFilter(searchParams: URLSearchParams, key: keyof NotesSearchFilters, value: string | number | boolean | undefined) {
  const nextParams = new URLSearchParams(searchParams);

  if (value === undefined || value === "") {
    nextParams.delete(key);
  } else {
    nextParams.set(key, String(value));
  }

  return nextParams;
}
