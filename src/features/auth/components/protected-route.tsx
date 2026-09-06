"use client";

import { ArrowRight, LockKeyhole } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthFormPanel } from "@/features/auth/components/auth-form-panel";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth();

  if (status === "loading") {
    return (
      <AuthLayout>
        <AuthFormPanel eyebrow="Restoring your session" title="Opening your workspace" description="We’re securely checking your Notiva session.">
          <div className="space-y-3" aria-label="Loading your account" aria-busy="true">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-11 w-2/3" />
          </div>
        </AuthFormPanel>
      </AuthLayout>
    );
  }

  if (status === "unauthenticated") {
    return (
      <AuthLayout>
        <AuthFormPanel
          eyebrow="Protected workspace"
          title="Sign in to continue"
          description="Your notes and account are protected. Sign in to open your personal workspace."
          footer={
            <Link className="rounded-sm font-medium text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring" href="/">
              Return to the Notiva homepage
            </Link>
          }
        >
          <div className="rounded-xl border bg-surface p-5 shadow-card">
            <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <LockKeyhole className="size-5" aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Sign in with your account to safely access this area.
            </p>
            <Button asChild className="mt-5 h-11 w-full">
              <Link href="/login">
                Go to sign in
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </AuthFormPanel>
      </AuthLayout>
    );
  }

  return children;
}
