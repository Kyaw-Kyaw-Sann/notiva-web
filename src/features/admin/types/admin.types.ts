import type { UserPlan, UserRole } from "@/features/auth/types/auth.types";

export type AdminDashboardStats = {
  totalUsers: number;
  totalNotes: number;
  totalAiRequests: number;
};

export type AdminUser = {
  id: number;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  plan: UserPlan;
  enabled: boolean;
  emailVerified: boolean;
  createdAt: string;
};

export type AdminUsersPage = {
  content: AdminUser[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type AdminUsersFilters = {
  search: string;
  page: number;
  size: number;
};
