import type { AdminDashboardStats, AdminUsersFilters, AdminUsersPage } from "@/features/admin/types/admin.types";
import { get } from "@/lib/api";

export function getAdminDashboard() {
  return get<AdminDashboardStats>("/api/admin/dashboard");
}

export function getAdminUsers({ page, search, size }: AdminUsersFilters) {
  return get<AdminUsersPage>("/api/admin/users", {
    params: {
      page,
      size,
      ...(search.trim() ? { search: search.trim() } : {}),
    },
  });
}
