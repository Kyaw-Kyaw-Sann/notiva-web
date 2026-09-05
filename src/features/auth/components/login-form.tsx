"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GoogleOAuthButton } from "@/features/auth/components/google-oauth-button";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/auth.schema";
import { normalizeApiError } from "@/lib/api";

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setSubmitError(null);

    try {
      await signIn(values);
      router.replace("/protected");
    } catch (error) {
      const apiError = normalizeApiError(error);
      const fieldErrors = apiError.validationErrors;

      if (fieldErrors?.email) form.setError("email", { type: "server", message: fieldErrors.email });
      if (fieldErrors?.password) form.setError("password", { type: "server", message: fieldErrors.password });
      setSubmitError(apiError.message);
    }
  }

  return (
    <div className="space-y-5">
      <GoogleOAuthButton />
      <div className="flex items-center gap-3"><Separator className="flex-1" /><span className="text-xs text-muted-foreground">or continue with email</span><Separator className="flex-1" /></div>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        {submitError && <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{submitError}</div>}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" aria-invalid={Boolean(form.formState.errors.email)} {...form.register("email")} />
          {form.formState.errors.email && <p role="alert" className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" aria-invalid={Boolean(form.formState.errors.password)} {...form.register("password")} />
          {form.formState.errors.password && <p role="alert" className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <LoaderCircle className="animate-spin" />}
          {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
