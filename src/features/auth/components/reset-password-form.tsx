"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, LoaderCircle, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/features/auth/api/auth-api";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/features/auth/schemas/auth.schema";
import type { VerifyResetOtpInput } from "@/features/auth/types/auth.types";
import { readPendingPasswordRecovery, removePendingPasswordRecovery } from "@/features/auth/utils/password-recovery-storage";
import { normalizeApiError } from "@/lib/api";

export function ResetPasswordForm() {
  const [recovery, setRecovery] = useState<VerifyResetOtpInput | null | undefined>(undefined);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    let isActive = true;

    async function loadRecovery() {
      await Promise.resolve();
      if (isActive) setRecovery(readPendingPasswordRecovery());
    }

    void loadRecovery();

    return () => {
      isActive = false;
    };
  }, []);

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!recovery) return;
    setSubmitError(null);

    try {
      const response = await resetPassword({
        email: recovery.email,
        otp: recovery.otp,
        newPassword: values.newPassword,
      });
      removePendingPasswordRecovery();
      setSuccessMessage(response.message);
      form.reset();
    } catch (error) {
      const apiError = normalizeApiError(error);
      if (apiError.validationErrors?.newPassword) {
        form.setError("newPassword", { type: "server", message: apiError.validationErrors.newPassword });
      }
      setSubmitError(apiError.message);
    }
  }

  if (recovery === undefined) {
    return (
      <div className="rounded-xl border bg-surface p-5 text-center" aria-live="polite" aria-busy="true">
        <LoaderCircle className="mx-auto size-6 animate-spin text-primary" aria-hidden="true" />
        <p className="mt-3 text-sm text-muted-foreground">Loading your verified request…</p>
      </div>
    );
  }

  if (!recovery) {
    return (
      <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-5 text-center" role="alert">
        <AlertCircle className="mx-auto size-7 text-destructive" aria-hidden="true" />
        <h2 className="mt-3 font-semibold">Recovery session unavailable</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Request and verify a new recovery code before setting a password.</p>
        <Button asChild className="mt-5 h-11 w-full">
          <Link href="/forgot-password">Start account recovery</Link>
        </Button>
      </div>
    );
  }

  if (successMessage) {
    return (
      <div className="rounded-xl border border-success/25 bg-success/5 p-5 text-center" role="status">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-lg font-semibold">Password updated</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{successMessage}</p>
        <Button asChild className="mt-5 h-11 w-full">
          <Link href="/login">Return to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      {submitError && (
        <div role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3.5 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {submitError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="newPassword">New password</Label>
        <Input id="newPassword" type="password" autoComplete="new-password" placeholder="Create a secure password" className="h-11" aria-invalid={Boolean(form.formState.errors.newPassword)} {...form.register("newPassword")} />
        {form.formState.errors.newPassword && <p role="alert" className="text-xs text-destructive">{form.formState.errors.newPassword.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmNewPassword">Confirm new password</Label>
        <Input id="confirmNewPassword" type="password" autoComplete="new-password" placeholder="Repeat your new password" className="h-11" aria-invalid={Boolean(form.formState.errors.confirmPassword)} {...form.register("confirmPassword")} />
        {form.formState.errors.confirmPassword && <p role="alert" className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" className="h-11 w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <LockKeyhole aria-hidden="true" />}
        {form.formState.isSubmitting ? "Updating password…" : "Set new password"}
      </Button>
    </form>
  );
}
