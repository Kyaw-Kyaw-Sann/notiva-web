"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, LoaderCircle, MailCheck } from "lucide-react";
import Link from "next/link";
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
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: RegisterFormValues) {
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      const response = await register({
        displayName: values.displayName,
        email: values.email,
        password: values.password,
      });
      setSuccessMessage(response.message);
      setRegisteredEmail(values.email);
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

  if (successMessage) {
    return (
      <div role="status" className="rounded-xl border border-success/25 bg-success/5 p-5 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/15 text-success">
          <MailCheck className="size-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-lg font-semibold">Check your inbox</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{successMessage}</p>
        {registeredEmail && <p className="mt-2 break-all text-sm font-medium text-foreground">{registeredEmail}</p>}
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Open the verification link before signing in. If you cannot find the email, check your spam folder.
        </p>
        <Button asChild className="mt-5 h-11 w-full">
          <Link href="/login">Continue to sign in</Link>
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
        <Label htmlFor="displayName">Display name</Label>
        <Input id="displayName" autoComplete="name" placeholder="Your name" className="h-11" aria-invalid={Boolean(form.formState.errors.displayName)} {...form.register("displayName")} />
        {form.formState.errors.displayName && <p role="alert" className="text-xs text-destructive">{form.formState.errors.displayName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="registerEmail">Email</Label>
        <Input id="registerEmail" type="email" autoComplete="email" placeholder="you@example.com" className="h-11" aria-invalid={Boolean(form.formState.errors.email)} {...form.register("email")} />
        {form.formState.errors.email && <p role="alert" className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="registerPassword">Password</Label>
        <Input id="registerPassword" type="password" autoComplete="new-password" placeholder="Create a secure password" className="h-11" aria-invalid={Boolean(form.formState.errors.password)} {...form.register("password")} />
        {form.formState.errors.password && <p role="alert" className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input id="confirmPassword" type="password" autoComplete="new-password" placeholder="Repeat your password" className="h-11" aria-invalid={Boolean(form.formState.errors.confirmPassword)} {...form.register("confirmPassword")} />
        {form.formState.errors.confirmPassword && <p role="alert" className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" className="h-11 w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting && <LoaderCircle className="animate-spin" aria-hidden="true" />}
        {form.formState.isSubmitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
