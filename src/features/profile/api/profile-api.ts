import type { AvatarUploadResponse, ChangePasswordInput, UpdateProfileInput, UserProfile } from "@/features/profile/types/profile.types";
import { get, patch, post, remove } from "@/lib/api";

export function getProfile() { return get<UserProfile>("/api/users/me"); }
export function updateProfile(payload: UpdateProfileInput) { return patch<UserProfile, UpdateProfileInput>("/api/users/me", payload); }
export function changePassword(payload: ChangePasswordInput) { return patch<null, ChangePasswordInput>("/api/users/me/password", payload); }

export function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return post<AvatarUploadResponse, FormData>("/api/users/me/avatar", formData);
}

export function removeAvatar() { return remove<null>("/api/users/me/avatar"); }
export function upgradePlan() { return patch<UserProfile>("/api/users/me/upgrade"); }
export function downgradePlan() { return patch<UserProfile>("/api/users/me/downgrade"); }
export function deleteAccount() { return remove<null>("/api/users/me"); }
