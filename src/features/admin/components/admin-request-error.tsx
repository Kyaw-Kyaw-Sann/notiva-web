"use client";

import { LogIn, RotateCcw } from "lucide-react";
import Link from "next/link";

import { ErrorState } from "@/components/common/error-state";
import { Button } from "@/components/ui/button";
import { normalizeApiError } from "@/lib/api";

export function AdminRequestError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const apiError = normalizeApiError(error);

  if (apiError.status === 401) {
    return <ErrorState title="Administrator session required" description="Your session is unavailable. Sign in again to continue." action={<Button asChild><Link href="/login"><LogIn />Sign in</Link></Button>} />;
  }

  if (apiError.status === 403) {
    return <ErrorState title="Access denied" description="Your account does not have permission to access this admin resource." action={<Button asChild variant="outline"><Link href="/notes">Return to workspace</Link></Button>} />;
  }

  return <ErrorState title="Could not load admin data" description={apiError.message} action={<Button type="button" onClick={onRetry}><RotateCcw />Try again</Button>} />;
}
