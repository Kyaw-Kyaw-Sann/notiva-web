"use client";

import { AlertCircle, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        router.replace("/protected");
      } catch (error) {
        setErrorMessage(normalizeApiError(error).message);
      }
    }

    void finishOAuth();
  }, [completeOAuth, router]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="items-center">
          {errorMessage ? <AlertCircle className="size-8 text-destructive" /> : <LoaderCircle className="size-8 animate-spin text-primary" />}
          <CardTitle className="mt-2">{errorMessage ? "Could not sign you in" : "Completing sign in"}</CardTitle>
          <CardDescription>{errorMessage ?? "Securely loading your Notiva account…"}</CardDescription>
        </CardHeader>
        {errorMessage && <CardContent><Button asChild className="w-full"><Link href="/login">Back to login</Link></Button></CardContent>}
      </Card>
    </main>
  );
}
