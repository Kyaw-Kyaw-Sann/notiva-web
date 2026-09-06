import type { AuthUser } from "@/features/auth/types/auth.types";

export type UserProfile = AuthUser & {
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfileInput = { displayName: string };

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type AvatarUploadResponse = {
  avatarUrl: string;
  avatarPublicId: string;
};
