"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { changePassword, deleteAccount, downgradePlan, getProfile, removeAvatar, updateProfile, upgradePlan, uploadAvatar } from "@/features/profile/api/profile-api";
import type { ChangePasswordInput, UpdateProfileInput, UserProfile } from "@/features/profile/types/profile.types";

export const profileQueryKey = ["profile", "me"] as const;

export function useProfile(enabled = true) {
  return useQuery({ queryKey: profileQueryKey, queryFn: getProfile, enabled });
}

function useProfileSync() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  function setProfile(profile: UserProfile) {
    queryClient.setQueryData(profileQueryKey, profile);
    updateUser(profile);
  }

  async function refetchProfile() {
    await queryClient.invalidateQueries({ queryKey: profileQueryKey, refetchType: "none" });
    const profile = await queryClient.fetchQuery({ queryKey: profileQueryKey, queryFn: getProfile });
    updateUser(profile);
  }

  return { refetchProfile, setProfile };
}

export function useUpdateProfile() {
  const { setProfile } = useProfileSync();
  return useMutation({ mutationFn: (payload: UpdateProfileInput) => updateProfile(payload), onSuccess: setProfile });
}

export function useUploadAvatar() {
  const { refetchProfile } = useProfileSync();
  return useMutation({ mutationFn: uploadAvatar, onSuccess: refetchProfile });
}

export function useRemoveAvatar() {
  const { refetchProfile } = useProfileSync();
  return useMutation({ mutationFn: removeAvatar, onSuccess: refetchProfile });
}

export function useChangePassword() {
  return useMutation({ mutationFn: (payload: ChangePasswordInput) => changePassword(payload) });
}

export function useChangePlan() {
  const { setProfile } = useProfileSync();
  return useMutation({
    mutationFn: (plan: "NORMAL" | "PREMIUM") => plan === "PREMIUM" ? upgradePlan() : downgradePlan(),
    onSuccess: setProfile,
  });
}

export function useDeleteAccount() {
  return useMutation({ mutationFn: deleteAccount });
}
