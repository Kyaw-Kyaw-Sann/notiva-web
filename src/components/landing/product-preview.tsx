import { History, PanelLeftOpen } from "lucide-react";
import Image from "next/image";

import { PageContainer } from "@/components/layout/page-container";

export function ProductPreview() {
  return (
    <section id="product" className="scroll-mt-20 border-b bg-surface-muted/50 py-16 sm:py-20 lg:py-24">
      <PageContainer className="py-0">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Built for real workflows</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Reliable when your notes keep evolving</h2>
          <p className="mt-4 leading-7 text-muted-foreground">Return to earlier work with confidence and keep the same focused navigation across desktop and mobile.</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.38fr]">
          <article className="overflow-hidden rounded-xl border bg-card">
            <div className="flex items-start gap-3 p-5 sm:p-6">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary"><History className="size-5" /></span>
              <div><h3 className="font-semibold">Version history you can trust</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">Preview a saved version before restoring it to the current note.</p></div>
            </div>
            <div className="border-t bg-surface p-2 sm:p-3"><Image src="/DS3.png" alt="Notiva version history dialog with saved versions, content preview, and restore action" width={1858} height={913} sizes="(max-width: 1024px) 94vw, 820px" className="h-auto w-full rounded-lg border" /></div>
          </article>

          <article className="overflow-hidden rounded-xl border bg-card">
            <div className="flex items-start gap-3 p-5 sm:p-6">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary"><PanelLeftOpen className="size-5" /></span>
              <div><h3 className="font-semibold">Navigation that adapts</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">The full workspace remains easy to reach from a compact mobile drawer.</p></div>
            </div>
            <div className="flex min-h-80 justify-center border-t bg-surface-muted p-4"><Image src="/DS5.png" alt="Notiva mobile navigation drawer with workspace links, category counts, theme control, and profile" width={247} height={558} sizes="247px" className="h-auto max-h-[34rem] w-auto rounded-lg border shadow-card" /></div>
          </article>
        </div>
      </PageContainer>
    </section>
  );
}
