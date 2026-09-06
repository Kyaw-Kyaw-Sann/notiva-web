"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, ShieldAlert, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useChangePassword, useDeleteAccount } from "@/features/profile/hooks/use-profile";
import { changePasswordSchema, type ChangePasswordFormValues } from "@/features/profile/schemas/profile.schema";
import { SettingsContent } from "@/features/settings/components/appearance-settings";
import { normalizeApiError } from "@/lib/api";

export function SecuritySettings() {
  return (
    <SettingsContent title="Security & Privacy" description="Protect your account and control permanent account actions.">
      <ChangePasswordForm />
      <DeleteAccountSection />
    </SettingsContent>
  );
}

function ChangePasswordForm() {
  const mutation = useChangePassword();
  const form = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema), defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" } });

  async function submit(values: ChangePasswordFormValues) {
    try {
      await mutation.mutateAsync({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      form.reset();
      toast.success("Password changed successfully");
    } catch (error) {
      const apiError = normalizeApiError(error);
      const fieldErrors = apiError.validationErrors;
      if (fieldErrors?.currentPassword) form.setError("currentPassword", { type: "server", message: fieldErrors.currentPassword });
      if (fieldErrors?.newPassword) form.setError("newPassword", { type: "server", message: fieldErrors.newPassword });
      if (!fieldErrors?.currentPassword && !fieldErrors?.newPassword) form.setError("root", { type: "server", message: apiError.message });
    }
  }

  return (
    <form className="border-b py-6" onSubmit={form.handleSubmit(submit)} noValidate>
      <h3 className="text-sm font-semibold">Change password</h3>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">Use your current password to set a new password.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <PasswordField id="current-password" label="Current password" error={form.formState.errors.currentPassword?.message} registration={form.register("currentPassword")} />
        <div />
        <PasswordField id="new-password" label="New password" error={form.formState.errors.newPassword?.message} registration={form.register("newPassword")} />
        <PasswordField id="confirm-password" label="Confirm new password" error={form.formState.errors.confirmPassword?.message} registration={form.register("confirmPassword")} />
      </div>
      {form.formState.errors.root && <p className="mt-3 text-sm text-destructive" role="alert">{form.formState.errors.root.message}</p>}
      <Button className="mt-4" type="submit" disabled={mutation.isPending}>{mutation.isPending && <LoaderCircle className="animate-spin" />}Change password</Button>
    </form>
  );
}

function PasswordField({ error, id, label, registration }: { error?: string; id: string; label: string; registration: UseFormRegisterReturn }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><Input id={id} type="password" autoComplete={id === "current-password" ? "current-password" : "new-password"} aria-invalid={Boolean(error)} {...registration} />{error && <p className="text-xs text-destructive" role="alert">{error}</p>}</div>;
}

function DeleteAccountSection() {
  const [confirmation, setConfirmation] = useState("");
  const [open, setOpen] = useState(false);
  const mutation = useDeleteAccount();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { clearSession } = useAuth();

  async function confirmDelete() {
    try {
      await mutation.mutateAsync();
      queryClient.clear();
      clearSession();
      router.replace("/");
      toast.success("Your account has been deleted");
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    }
  }

  return (
    <section className="py-6">
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
        <div className="flex gap-3"><ShieldAlert className="mt-0.5 size-5 shrink-0 text-destructive" /><div><h3 className="font-semibold text-destructive">Delete account</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p></div></div>
        <Dialog open={open} onOpenChange={(nextOpen) => { setOpen(nextOpen); if (!nextOpen) setConfirmation(""); }}>
          <DialogTrigger asChild><Button className="mt-4" type="button" variant="destructive"><Trash2 />Delete account</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Delete your Notiva account?</DialogTitle><DialogDescription>This permanently removes your profile and associated data. Type <strong>DELETE</strong> to confirm.</DialogDescription></DialogHeader>
            <div className="mt-5 space-y-2"><Label htmlFor="delete-account-confirmation">Confirmation</Label><Input id="delete-account-confirmation" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Type DELETE" autoComplete="off" /></div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="button" variant="destructive" disabled={confirmation !== "DELETE" || mutation.isPending} onClick={() => void confirmDelete()}>{mutation.isPending && <LoaderCircle className="animate-spin" />}Permanently delete</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
