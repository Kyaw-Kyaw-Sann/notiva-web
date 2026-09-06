export type NoteBackgroundColor = "DEFAULT" | "YELLOW" | "GREEN" | "BLUE" | "PINK" | "PURPLE" | "GRAY";

export type NoteCategory = {
  id: number;
  name: string;
};

export type Note = {
  id: number;
  title: string;
  contentJson: string;
  plainText: string;
  backgroundColor: NoteBackgroundColor;
  category: NoteCategory | null;
  pinned: boolean;
  favorite: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NotePayload = {
  title: string;
  contentJson: string;
  plainText: string;
  backgroundColor: NoteBackgroundColor;
  categoryId: number | null;
};

export type NotesView = "all" | "pinned" | "favorites" | "trash";

export type NoteSort = "UPDATED_DESC" | "UPDATED_ASC" | "CREATED_DESC" | "CREATED_ASC" | "TITLE_ASC" | "TITLE_DESC";

export type NotesSearchFilters = {
  backgroundColor?: NoteBackgroundColor;
  categoryId?: number;
  favorite?: boolean;
  page: number;
  pinned?: boolean;
  query?: string;
  size: number;
  sort: NoteSort;
  uncategorized?: boolean;
};

export type NotesPage = {
  content: Note[];
  first: boolean;
  last: boolean;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type NoteVersionSummary = {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type NoteVersion = NoteVersionSummary & {
  contentJson: string;
  plainText: string;
  backgroundColor: NoteBackgroundColor;
};
