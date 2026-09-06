"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AdminUsersPage } from "@/features/admin/types/admin.types";

export function AdminPagination({ page, onPageChange }: { page: AdminUsersPage; onPageChange: (page: number) => void }) {
  if (page.totalPages <= 1) return null;

  return (
    <nav className="mt-5 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between" aria-label="Users pagination">
      <p className="text-muted-foreground">Page {page.page + 1} of {page.totalPages} · {page.totalElements.toLocaleString()} users</p>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" disabled={page.first} onClick={() => onPageChange(page.page - 1)}><ChevronLeft />Previous</Button>
        <Button type="button" variant="outline" size="sm" disabled={page.last} onClick={() => onPageChange(page.page + 1)}>Next<ChevronRight /></Button>
      </div>
    </nav>
  );
}
