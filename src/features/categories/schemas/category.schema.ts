import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Enter a category name.").max(100, "Use 100 characters or fewer."),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
