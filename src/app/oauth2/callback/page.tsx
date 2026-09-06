"use client";

import { AlertCircle, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { AuthFormPanel } from "@/features/auth/components/auth-form-panel";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { normalizeApiError } from "@/lib/api";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const { completeOAuth } = useAuth();
  const started = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const query = new URLSearchParams(window.location.search);
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get("access_token");

    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);

    async function finishOAuth() {
      await Promise.resolve();

      if (query.has("error")) {
        setErrorMessage("Google authentication failed. Please try again.");
        return;
      }

      if (!accessToken) {
        setErrorMessage("The Google sign-in response was incomplete. Please try again.");
        return;
      }

      try {
        await completeOAuth(accessToken);
        router.replace("/notes");
      } catch (error) {
        setErrorMessage(normalizeApiError(error).message);
      }
    }

    void finishOAuth();
  }, [completeOAuth, router]);

  return (
    <AuthLayout>
      <AuthFormPanel
        eyebrow={errorMessage ? "Sign-in interrupted" : "Secure sign-in"}
        title={errorMessage ? "Could not sign you in" : "Completing your sign in"}
        description={errorMessage ?? "We’re securely loading your Notiva workspace."}
      >
        <div className="rounded-xl border bg-surface p-5 text-center shadow-card" aria-live="polite">
          {errorMessage ? (
            <>
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="size-6" aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm text-muted-foreground">Your account has not been changed.</p>
              <Button asChild className="mt-5 h-11 w-full">
                <Link href="/login">Back to sign in</Link>
              </Button>
            </>
          ) : (
            <>
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-primary">
                <LoaderCircle className="size-6 animate-spin" aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm text-muted-foreground">This will only take a moment.</p>
            </>
          )}
        </div>
      </AuthFormPanel>
    </AuthLayout>
  );
}
