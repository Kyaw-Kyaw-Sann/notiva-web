"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, CheckCircle2, LoaderCircle, Trash2 } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ErrorState } from "@/components/common/error-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useChangePlan, useProfile, useRemoveAvatar, useUpdateProfile, useUploadAvatar } from "@/features/profile/hooks/use-profile";
import { profileSchema, type ProfileFormValues } from "@/features/profile/schemas/profile.schema";
import { SettingsContent } from "@/features/settings/components/appearance-settings";
import { normalizeApiError } from "@/lib/api";

function getInitials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export function ProfileSettings() {
  const profileQuery = useProfile();

  if (profileQuery.isLoading) return <ProfileSkeleton />;
  if (profileQuery.isError || !profileQuery.data) {
    return <ErrorState title="Could not load profile" description={normalizeApiError(profileQuery.error).message} action={<Button onClick={() => void profileQuery.refetch()}>Try again</Button>} />;
  }

  return <ProfileSettingsContent key={`${profileQuery.data.id}-${profileQuery.data.updatedAt}`} profile={profileQuery.data} />;
}

function ProfileSettingsContent({ profile }: { profile: NonNullable<ReturnType<typeof useProfile>["data"]> }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateMutation = useUpdateProfile();
  const uploadMutation = useUploadAvatar();
  const removeMutation = useRemoveAvatar();
  const planMutation = useChangePlan();
  const form = useForm<ProfileFormValues>({ resolver: zodResolver(profileSchema), defaultValues: { displayName: profile.displayName } });
  const avatarBusy = uploadMutation.isPending || removeMutation.isPending;

  async function submit(values: ProfileFormValues) {
    try {
      await updateMutation.mutateAsync({ displayName: values.displayName.trim() });
      toast.success("Profile updated");
      form.reset(values);
    } catch (error) {
      const apiError = normalizeApiError(error);
      if (apiError.validationErrors?.displayName) form.setError("displayName", { type: "server", message: apiError.validationErrors.displayName });
      else form.setError("root", { type: "server", message: apiError.message });
    }
  }

  async function selectAvatar(file: File | undefined) {
    if (!file) return;
    try {
      await uploadMutation.mutateAsync(file);
      toast.success("Avatar updated");
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function removeCurrentAvatar() {
    try {
      await removeMutation.mutateAsync();
      toast.success("Avatar removed");
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    }
  }

  async function changePlan() {
    const nextPlan = profile.plan === "NORMAL" ? "PREMIUM" : "NORMAL";
    try {
      await planMutation.mutateAsync(nextPlan);
      toast.success(nextPlan === "PREMIUM" ? "Plan upgraded" : "Plan downgraded");
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    }
  }

  return (
    <SettingsContent title="Profile" description="Manage your personal details, avatar, and Notiva plan.">
      <section className="border-b py-6">
        <h3 className="text-sm font-semibold">Profile photo</h3>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-secondary text-lg font-semibold text-secondary-foreground">
            {profile.avatarUrl
              ? <span className="size-full bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(profile.avatarUrl)})` }} role="img" aria-label={`${profile.displayName}'s avatar`} />
              : getInitials(profile.displayName)}
          </div>
          <div className="flex flex-wrap gap-2">
            <input ref={fileInputRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void selectAvatar(event.target.files?.[0])} />
            <Button type="button" variant="outline" disabled={avatarBusy} onClick={() => fileInputRef.current?.click()}>
              {uploadMutation.isPending ? <LoaderCircle className="animate-spin" /> : <Camera />} Upload photo
            </Button>
            {profile.avatarUrl && <Button type="button" variant="ghost" disabled={avatarBusy} onClick={() => void removeCurrentAvatar()}><Trash2 />Remove</Button>}
          </div>
        </div>
      </section>

      <form className="border-b py-6" onSubmit={form.handleSubmit(submit)} noValidate>
        <h3 className="text-sm font-semibold">Personal information</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="settings-display-name">Display name</Label><Input id="settings-display-name" aria-invalid={Boolean(form.formState.errors.displayName)} {...form.register("displayName")} />{form.formState.errors.displayName && <p className="text-xs text-destructive" role="alert">{form.formState.errors.displayName.message}</p>}</div>
          <div className="space-y-2"><Label htmlFor="settings-email">Email</Label><Input id="settings-email" value={profile.email} disabled readOnly /><p className="text-xs text-muted-foreground">Email cannot be changed here.</p></div>
        </div>
        {form.formState.errors.root && <p className="mt-3 text-sm text-destructive" role="alert">{form.formState.errors.root.message}</p>}
        <Button className="mt-4" type="submit" disabled={!form.formState.isDirty || updateMutation.isPending}>{updateMutation.isPending && <LoaderCircle className="animate-spin" />}Save profile</Button>
      </form>

      <section className="py-6">
        <div className="flex flex-col gap-4 rounded-xl border bg-surface-muted/45 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div><div className="flex items-center gap-2"><CheckCircle2 className="size-4 text-primary" /><h3 className="font-semibold">{profile.plan} plan</h3></div><p className="mt-1 text-sm text-muted-foreground">Your plan controls the AI usage available to your account.</p></div>
          <Button type="button" variant="outline" disabled={planMutation.isPending} onClick={() => void changePlan()}>{planMutation.isPending && <LoaderCircle className="animate-spin" />}{profile.plan === "NORMAL" ? "Upgrade plan" : "Downgrade plan"}</Button>
        </div>
      </section>
    </SettingsContent>
  );
}

function ProfileSkeleton() {
  return <div className="mx-auto max-w-3xl space-y-6"><Skeleton className="h-8 w-36" /><Skeleton className="h-4 w-72" /><Skeleton className="h-px w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-40 w-full" /></div>;
}
