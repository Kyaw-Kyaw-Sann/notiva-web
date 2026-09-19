import { ArrowLeft, FileQuestion } from "lucide-react";
import Link from "next/link";

import { NotivaBrand } from "@/components/landing/notiva-brand";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col bg-background px-5 py-6 sm:px-8">
      <NotivaBrand />
      <section className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center text-center">
        <FileQuestion className="size-8 text-primary" aria-hidden="true" />
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-primary">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-3 leading-7 text-muted-foreground">The page may have moved, or the address may be incorrect.</p>
        <Button asChild className="mt-7"><Link href="/"><ArrowLeft aria-hidden="true" />Return home</Link></Button>
      </section>
    </main>
  );
}
