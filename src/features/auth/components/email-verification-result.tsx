"use client";

import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/features/auth/api/auth-api";
import { normalizeApiError } from "@/lib/api";

type VerificationState =
  | { status: "loading"; message: string }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export function EmailVerificationResult() {
  const started = useRef(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [state, setState] = useState<VerificationState>({
    status: "loading",
    message: "We’re securely verifying your email address.",
  });

  const runVerification = useCallback(async (token: string) => {
    setState({ status: "loading", message: "We’re securely verifying your email address." });

    try {
      const response = await verifyEmail(token);
      setState({ status: "success", message: response.message });
    } catch (error) {
      setState({ status: "error", message: normalizeApiError(error).message });
    }
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    window.history.replaceState(null, "", window.location.pathname);

    async function startVerification() {
      await Promise.resolve();
      setVerificationToken(token);

      if (!token) {
        setState({ status: "error", message: "This verification link is incomplete. Request a new verification email and try again." });
        return;
      }

      await runVerification(token);
    }

    void startVerification();
  }, [runVerification]);

  if (state.status === "loading") {
    return (
      <div className="rounded-xl border bg-surface p-5 text-center" aria-live="polite" aria-busy="true">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-primary">
          <LoaderCircle className="size-6 animate-spin" aria-hidden="true" />
        </span>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-success/25 bg-success/5 p-5 text-center" role="status">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-lg font-semibold">Email verified</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{state.message}</p>
        <Button asChild className="mt-5 h-11 w-full">
          <Link href="/login">Continue to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-5 text-center" role="alert">
      <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="size-6" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-semibold">Verification unsuccessful</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{state.message}</p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <Button asChild variant="outline" className="h-11">
          <Link href="/login">Back to sign in</Link>
        </Button>
        <Button
          type="button"
          className="h-11"
          disabled={!verificationToken}
          onClick={() => {
            if (verificationToken) void runVerification(verificationToken);
          }}
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
