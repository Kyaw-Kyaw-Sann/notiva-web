"use client";

import { ArrowLeft, LogIn, ShieldX } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function AdminRoute({ children }: { children: ReactNode }) {
  const { status, user } = useAuth();

  if (status === "loading") {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background p-6" aria-label="Checking administrator access" aria-busy="true">
        <div className="w-full max-w-sm space-y-3"><Skeleton className="mx-auto size-12 rounded-full" /><Skeleton className="mx-auto h-7 w-48" /><Skeleton className="h-20 w-full" /></div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return <AdminAccessState code="401" title="Sign in required" description="Sign in with an administrator account to open this workspace." action={<Button asChild><Link href="/login"><LogIn />Go to sign in</Link></Button>} />;
  }

  if (user?.role !== "ADMIN") {
    return <AdminAccessState code="403" title="Access denied" description="Your account does not have administrator access. Notiva workspace data remains protected." action={<Button asChild variant="outline"><Link href="/notes"><ArrowLeft />Return to workspace</Link></Button>} />;
  }

  return children;
}

function AdminAccessState({ action, code, description, title }: { action: ReactNode; code: "401" | "403"; description: string; title: string }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-6">
      <section className="w-full max-w-md rounded-2xl border bg-surface p-8 text-center shadow-card">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive"><ShieldX aria-hidden="true" /></span>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Error {code}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
        <div className="mt-6 flex justify-center">{action}</div>
      </section>
    </main>
  );
}
