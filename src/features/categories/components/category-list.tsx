"use client";

import { AlertCircle, FolderPlus, LoaderCircle, Tag } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CategoryFormDialog } from "@/features/categories/components/category-form-dialog";
import { CategoryItem } from "@/features/categories/components/category-item";
import { DeleteCategoryDialog } from "@/features/categories/components/delete-category-dialog";
import { useCategories, useCategoryNoteCounts } from "@/features/categories/hooks/use-categories";
import type { Category } from "@/features/categories/types/category.types";
import { cn } from "@/lib/utils";

type CategoryListProps = {
  collapsed: boolean;
  onNavigate?: () => void;
};

export function CategoryList({ collapsed, onNavigate }: CategoryListProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formCategory, setFormCategory] = useState<Category | undefined>();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState<Category | undefined>();
  const { data: categories = [], isError, isLoading, refetch } = useCategories();
  const { categoryCounts, uncategorizedCount } = useCategoryNoteCounts(categories);
  const activeCategoryId = pathname === "/notes" ? Number(searchParams.get("categoryId")) : undefined;
  const isUncategorizedActive = pathname === "/notes" && searchParams.get("uncategorized") === "true";

  function openCreateDialog() {
    setFormCategory(undefined);
    setFormOpen(true);
  }

  function handleDeleted(category: Category) {
    if (activeCategoryId === category.id) {
      router.push("/notes?uncategorized=true");
    }
  }

  const itemClassName = cn(
    "flex min-h-10 items-center rounded-lg px-3 text-sm font-medium transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    collapsed && "justify-center px-0",
    isUncategorizedActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
  );

  return (
    <>
      <div className={cn("flex items-center justify-between px-3", collapsed && "justify-center px-0")}>
        {!collapsed && <h2 id="categories-heading" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categories</h2>}
        {collapsed && <span className="sr-only" id="categories-heading">Categories</span>}
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" onClick={openCreateDialog} aria-label="Create category" title="Create category">
          <FolderPlus aria-hidden="true" />
        </Button>
      </div>
      <div className="notiva-scrollbar mt-3 min-h-0 flex-1 overflow-y-auto px-3 pb-3" aria-labelledby="categories-heading">
        <div className="space-y-1">
          <Link href="/notes?uncategorized=true" onClick={onNavigate} className={itemClassName} aria-current={isUncategorizedActive ? "page" : undefined} title={collapsed ? "Uncategorized" : undefined}>
            <Tag className="size-4 shrink-0" aria-hidden="true" />
            {!collapsed && <span className="ml-3 min-w-0 flex-1 truncate">Uncategorized</span>}
            {!collapsed && <span className="ml-2 text-xs tabular-nums text-muted-foreground" aria-label={`${uncategorizedCount ?? 0} notes`}>{uncategorizedCount ?? "–"}</span>}
          </Link>
          {isLoading && <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground"><LoaderCircle className="size-3 animate-spin" />Loading categories</div>}
          {isError && !collapsed && <div className="space-y-2 px-3 py-2 text-xs text-destructive"><span className="flex items-center gap-1"><AlertCircle className="size-3" />Could not load categories.</span><Button variant="ghost" size="sm" className="h-7 px-1 text-xs" onClick={() => void refetch()}>Retry</Button></div>}
          {categories.map((category) => (
            <CategoryItem key={category.id} category={category} collapsed={collapsed} count={categoryCounts.get(category.id)} isActive={activeCategoryId === category.id} onNavigate={onNavigate} onRename={(nextCategory) => { setFormCategory(nextCategory); setFormOpen(true); }} onDelete={setDeleteCategory} />
          ))}
          {!isLoading && !isError && categories.length === 0 && !collapsed && <p className="px-3 py-2 text-xs leading-5 text-muted-foreground">No categories yet.</p>}
        </div>
      </div>
      {formOpen && <CategoryFormDialog category={formCategory} open onOpenChange={setFormOpen} />}
      <DeleteCategoryDialog category={deleteCategory} open={Boolean(deleteCategory)} onOpenChange={(open) => { if (!open) setDeleteCategory(undefined); }} onDeleted={handleDeleted} />
    </>
  );
}
