"use client";

import { Ellipsis, Pencil, Tag, Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Category } from "@/features/categories/types/category.types";
import { cn } from "@/lib/utils";

type CategoryItemProps = {
  category: Category;
  collapsed: boolean;
  count?: number;
  isActive: boolean;
  onDelete: (category: Category) => void;
  onNavigate?: () => void;
  onRename: (category: Category) => void;
};

export function CategoryItem({ category, collapsed, count, isActive, onDelete, onNavigate, onRename }: CategoryItemProps) {
  const itemClassName = cn(
    "flex min-h-10 min-w-0 flex-1 items-center rounded-lg px-3 text-sm font-medium transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    collapsed && "justify-center px-0",
    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
  );

  return (
    <div className="group flex items-center gap-1">
      <Link href={`/notes?categoryId=${category.id}`} onClick={onNavigate} className={itemClassName} aria-current={isActive ? "page" : undefined} title={collapsed ? category.name : undefined}>
        <Tag className="size-4 shrink-0" aria-hidden="true" />
        {!collapsed && <span className="ml-3 min-w-0 flex-1 truncate">{category.name}</span>}
        {!collapsed && <span className="ml-2 text-xs tabular-nums text-muted-foreground" aria-label={`${count ?? 0} notes`}>{count ?? "–"}</span>}
      </Link>
      {!collapsed && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 shrink-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100" aria-label={`Manage ${category.name}`}>
              <Ellipsis aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onRename(category)}><Pencil aria-hidden="true" />Rename</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => onDelete(category)}><Trash2 aria-hidden="true" />Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
