"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, LoaderCircle, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword, verifyResetOtp } from "@/features/auth/api/auth-api";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
  verifyResetOtpSchema,
  type VerifyResetOtpFormValues,
} from "@/features/auth/schemas/auth.schema";
import { writePendingPasswordRecovery } from "@/features/auth/utils/password-recovery-storage";
import { normalizeApiError } from "@/lib/api";

type RecoveryStep = "email" | "otp";

export function PasswordRecoveryForm() {
  const router = useRouter();
  const [step, setStep] = useState<RecoveryStep>("email");
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const emailForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });
  const otpForm = useForm<VerifyResetOtpFormValues>({
    resolver: zodResolver(verifyResetOtpSchema),
    defaultValues: { otp: "" },
  });

  async function submitEmail(values: ForgotPasswordFormValues) {
    setSubmitError(null);
    setStatusMessage(null);

    try {
      const response = await forgotPassword(values);
      setEmail(values.email);
      setStatusMessage(response.message);
      setStep("otp");
    } catch (error) {
      const apiError = normalizeApiError(error);
      if (apiError.validationErrors?.email) {
        emailForm.setError("email", { type: "server", message: apiError.validationErrors.email });
      }
      setSubmitError(apiError.message);
    }
  }

  async function submitOtp(values: VerifyResetOtpFormValues) {
    setSubmitError(null);

    try {
      await verifyResetOtp({ email, otp: values.otp });
      writePendingPasswordRecovery({ email, otp: values.otp });
      router.push("/reset-password");
    } catch (error) {
      const apiError = normalizeApiError(error);
      if (apiError.validationErrors?.otp) {
        otpForm.setError("otp", { type: "server", message: apiError.validationErrors.otp });
      }
      setSubmitError(apiError.message);
    }
  }

  if (step === "otp") {
    return (
      <div className="space-y-5">
        <div className="rounded-xl border bg-surface-muted p-4">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
              <Mail className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium">Check your email</p>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">{statusMessage}</p>
              <p className="mt-2 truncate text-xs font-medium text-foreground">{email}</p>
            </div>
          </div>
        </div>

        <form className="space-y-4" onSubmit={otpForm.handleSubmit(submitOtp)} noValidate>
          {submitError && (
            <div role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3.5 py-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {submitError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="resetOtp">Verification code</Label>
            <Input
              id="resetOtp"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Enter the code from your email"
              className="h-11 tracking-widest"
              aria-invalid={Boolean(otpForm.formState.errors.otp)}
              {...otpForm.register("otp")}
            />
            {otpForm.formState.errors.otp && <p role="alert" className="text-xs text-destructive">{otpForm.formState.errors.otp.message}</p>}
          </div>

          <Button type="submit" className="h-11 w-full" disabled={otpForm.formState.isSubmitting}>
            {otpForm.formState.isSubmitting ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <ShieldCheck aria-hidden="true" />}
            {otpForm.formState.isSubmitting ? "Verifying…" : "Verify code"}
          </Button>
        </form>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => {
            setStep("email");
            setSubmitError(null);
            setStatusMessage(null);
            otpForm.reset();
          }}
        >
          <ArrowLeft aria-hidden="true" />
          Use a different email
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <form className="space-y-4" onSubmit={emailForm.handleSubmit(submitEmail)} noValidate>
        {submitError && (
          <div role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3.5 py-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {submitError}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="recoveryEmail">Email</Label>
          <Input
            id="recoveryEmail"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-11"
            aria-invalid={Boolean(emailForm.formState.errors.email)}
            {...emailForm.register("email")}
          />
          {emailForm.formState.errors.email && <p role="alert" className="text-xs text-destructive">{emailForm.formState.errors.email.message}</p>}
        </div>

        <Button type="submit" className="h-11 w-full" disabled={emailForm.formState.isSubmitting}>
          {emailForm.formState.isSubmitting && <LoaderCircle className="animate-spin" aria-hidden="true" />}
          {emailForm.formState.isSubmitting ? "Sending code…" : "Send recovery code"}
        </Button>
      </form>

      <Button asChild variant="ghost" className="w-full">
        <Link href="/login">
          <ArrowLeft aria-hidden="true" />
          Back to sign in
        </Link>
      </Button>
    </div>
  );
}
