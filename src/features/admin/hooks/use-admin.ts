"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminDashboard, getAdminUsers } from "@/features/admin/api/admin-api";
import type { AdminUsersFilters } from "@/features/admin/types/admin.types";

export const adminQueryKeys = {
  dashboard: ["admin", "dashboard"] as const,
  users: (filters: AdminUsersFilters) => ["admin", "users", filters] as const,
};

export function useAdminDashboard() {
  return useQuery({ queryKey: adminQueryKeys.dashboard, queryFn: getAdminDashboard });
}

export function useAdminUsers(filters: AdminUsersFilters) {
  return useQuery({
    queryKey: adminQueryKeys.users(filters),
    queryFn: () => getAdminUsers(filters),
    placeholderData: (previousData) => previousData,
  });
}
