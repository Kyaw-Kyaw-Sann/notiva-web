"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/features/auth/api/auth-api";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas/auth.schema";
import { normalizeApiError } from "@/lib/api";

export function RegisterForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: RegisterFormValues) {
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      const response = await register({ displayName: values.displayName, email: values.email, password: values.password });
      setSuccessMessage(response.message);
      form.reset();
    } catch (error) {
      const apiError = normalizeApiError(error);
      const fieldErrors = apiError.validationErrors;

      if (fieldErrors?.displayName) form.setError("displayName", { type: "server", message: fieldErrors.displayName });
      if (fieldErrors?.email) form.setError("email", { type: "server", message: fieldErrors.email });
      if (fieldErrors?.password) form.setError("password", { type: "server", message: fieldErrors.password });
      setSubmitError(apiError.message);
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      {submitError && <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{submitError}</div>}
      {successMessage && <div role="status" className="flex gap-2 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success"><CheckCircle2 className="mt-0.5 size-4 shrink-0" />{successMessage}</div>}
      <div className="space-y-2"><Label htmlFor="displayName">Display name</Label><Input id="displayName" autoComplete="name" aria-invalid={Boolean(form.formState.errors.displayName)} {...form.register("displayName")} />{form.formState.errors.displayName && <p role="alert" className="text-xs text-destructive">{form.formState.errors.displayName.message}</p>}</div>
      <div className="space-y-2"><Label htmlFor="registerEmail">Email</Label><Input id="registerEmail" type="email" autoComplete="email" aria-invalid={Boolean(form.formState.errors.email)} {...form.register("email")} />{form.formState.errors.email && <p role="alert" className="text-xs text-destructive">{form.formState.errors.email.message}</p>}</div>
      <div className="space-y-2"><Label htmlFor="registerPassword">Password</Label><Input id="registerPassword" type="password" autoComplete="new-password" aria-invalid={Boolean(form.formState.errors.password)} {...form.register("password")} />{form.formState.errors.password && <p role="alert" className="text-xs text-destructive">{form.formState.errors.password.message}</p>}</div>
      <div className="space-y-2"><Label htmlFor="confirmPassword">Confirm password</Label><Input id="confirmPassword" type="password" autoComplete="new-password" aria-invalid={Boolean(form.formState.errors.confirmPassword)} {...form.register("confirmPassword")} />{form.formState.errors.confirmPassword && <p role="alert" className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>}</div>
      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting && <LoaderCircle className="animate-spin" />}{form.formState.isSubmitting ? "Creating account…" : "Create account"}</Button>
    </form>
  );
}
