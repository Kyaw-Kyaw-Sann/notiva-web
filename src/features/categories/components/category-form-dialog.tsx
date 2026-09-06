"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCategory, useUpdateCategory } from "@/features/categories/hooks/use-categories";
import { categorySchema, type CategoryFormValues } from "@/features/categories/schemas/category.schema";
import type { Category } from "@/features/categories/types/category.types";
import { normalizeApiError } from "@/lib/api";

type CategoryFormDialogProps = {
  category?: Category;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export function CategoryFormDialog({ category, onOpenChange, open }: CategoryFormDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const isEditing = Boolean(category);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: category?.name ?? "" },
  });

  async function onSubmit(values: CategoryFormValues) {
    setSubmitError(null);

    try {
      if (category) {
        await updateCategory.mutateAsync({ categoryId: category.id, payload: values });
      } else {
        await createCategory.mutateAsync(values);
      }

      toast.success(isEditing ? "Category renamed" : "Category created");
      onOpenChange(false);
    } catch (error) {
      const apiError = normalizeApiError(error);
      if (apiError.validationErrors?.name) {
        form.setError("name", { type: "server", message: apiError.validationErrors.name });
      }
      setSubmitError(apiError.message);
    }
  }

  const isSubmitting = createCategory.isPending || updateCategory.isPending;
  const title = isEditing ? "Rename category" : "Create category";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{isEditing ? "Choose a new name for this category." : "Use categories to keep related notes together."}</DialogDescription>
        </DialogHeader>
        <form className="mt-5 space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <Label htmlFor="category-name">Category name</Label>
            <Input id="category-name" autoFocus maxLength={100} placeholder="For example, Work" aria-invalid={Boolean(form.formState.errors.name)} {...form.register("name")} />
            {form.formState.errors.name && <p className="text-xs text-destructive" role="alert">{form.formState.errors.name.message}</p>}
          </div>
          {submitError && <p className="text-sm text-destructive" role="alert">{submitError}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <LoaderCircle className="animate-spin" aria-hidden="true" />}
              {isEditing ? "Save changes" : "Create category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
