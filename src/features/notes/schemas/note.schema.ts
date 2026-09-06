import { z } from "zod";

import type { NoteBackgroundColor } from "@/features/notes/types/note.types";

export const noteBackgroundColors = ["DEFAULT", "YELLOW", "GREEN", "BLUE", "PINK", "PURPLE", "GRAY"] as const satisfies readonly NoteBackgroundColor[];

export const noteSchema = z.object({
  title: z.string().trim().min(1, "Enter a note title.").max(255, "Use 255 characters or fewer."),
  contentJson: z.string().min(1, "Note content could not be prepared."),
  plainText: z.string(),
  categoryId: z.number().int().positive().nullable(),
  backgroundColor: z.enum(noteBackgroundColors),
});

export type NoteFormValues = z.infer<typeof noteSchema>;
