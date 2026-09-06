"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDeleteCategory } from "@/features/categories/hooks/use-categories";
import type { Category } from "@/features/categories/types/category.types";
import { normalizeApiError } from "@/lib/api";

type DeleteCategoryDialogProps = {
  category?: Category;
  onDeleted: (category: Category) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export function DeleteCategoryDialog({ category, onDeleted, onOpenChange, open }: DeleteCategoryDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const deleteCategory = useDeleteCategory();

  async function handleDelete() {
    if (!category) return;

    setSubmitError(null);
    try {
      await deleteCategory.mutateAsync(category.id);
      toast.success("Category deleted");
      onDeleted(category);
      onOpenChange(false);
    } catch (error) {
      setSubmitError(normalizeApiError(error).message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { setSubmitError(null); onOpenChange(nextOpen); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {category?.name ?? "category"}?</DialogTitle>
          <DialogDescription>
            Notes will remain in Notiva. Notes in this category will become uncategorized.
          </DialogDescription>
        </DialogHeader>
        {submitError && <p className="mt-4 text-sm text-destructive" role="alert">{submitError}</p>}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="button" variant="destructive" onClick={() => void handleDelete()} disabled={deleteCategory.isPending}>
            {deleteCategory.isPending && <LoaderCircle className="animate-spin" aria-hidden="true" />}
            Delete category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
