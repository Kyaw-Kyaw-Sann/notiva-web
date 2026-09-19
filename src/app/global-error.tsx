"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-svh items-center justify-center bg-background px-5 py-10 text-foreground">
          <section className="w-full max-w-md rounded-xl border bg-surface p-6 text-center shadow-card">
            <AlertCircle className="mx-auto size-8 text-destructive" aria-hidden="true" />
            <h1 className="mt-5 text-2xl font-semibold tracking-tight">Something went wrong</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Notiva could not load this page. Your local work has not been intentionally discarded.</p>
            <Button type="button" className="mt-6" onClick={reset}><RefreshCw aria-hidden="true" />Try again</Button>
          </section>
        </main>
      </body>
    </html>
  );
}
