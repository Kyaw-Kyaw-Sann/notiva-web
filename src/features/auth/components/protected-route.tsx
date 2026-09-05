"use client";

import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState } from "@/components/common/loading-state";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth();

  if (status === "loading") {
    return <div className="mx-auto w-full max-w-md p-6"><LoadingState rows={3} /></div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="items-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground"><LockKeyhole className="size-5" /></div>
            <CardTitle className="mt-3">Authentication required</CardTitle>
            <CardDescription>Sign in to access this protected area.</CardDescription>
          </CardHeader>
          <CardContent><Button asChild className="w-full"><Link href="/login">Go to login</Link></Button></CardContent>
        </Card>
      </div>
    );
  }

  return children;
}
