import { MonitorSmartphone, SlidersHorizontal } from "lucide-react";
import Image from "next/image";

import { PageContainer } from "@/components/layout/page-container";

export function ProductPreview() {
  return (
    <section id="product" className="scroll-mt-20 border-b bg-surface-muted/50 py-16 sm:py-20 lg:py-24">
      <PageContainer className="py-0">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold text-primary">Built around your work</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">A workspace that stays out of your way</h2>
          <p className="mt-4 leading-7 text-muted-foreground">Organize the way you think, adjust the experience to fit, and keep the tools you need within easy reach.</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.38fr]">
          <article className="overflow-hidden rounded-2xl border bg-card shadow-card">
            <div className="flex items-start gap-3 p-5 sm:p-6">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary"><SlidersHorizontal className="size-5" /></span>
              <div><h3 className="font-semibold">Personal by default</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">Theme, note view, and editor width adapt to your preferred way of working.</p></div>
            </div>
            <div className="border-t bg-surface p-2 sm:p-3"><Image src="/UX3.png" alt="Notiva appearance settings for theme, notes view, and editor width" width={1586} height={992} sizes="(max-width: 1024px) 94vw, 820px" className="h-auto w-full rounded-lg border" /></div>
          </article>

          <article className="overflow-hidden rounded-2xl border bg-card shadow-card">
            <div className="flex items-start gap-3 p-5 sm:p-6">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary"><MonitorSmartphone className="size-5" /></span>
              <div><h3 className="font-semibold">Ready for every screen</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">A compact navigation experience keeps your notes reachable on mobile.</p></div>
            </div>
            <div className="flex min-h-80 justify-center border-t bg-surface-muted p-4"><Image src="/ss4.png" alt="Notiva mobile navigation drawer" width={247} height={557} sizes="247px" className="h-auto max-h-[34rem] w-auto rounded-lg border shadow-card" /></div>
          </article>
        </div>
      </PageContainer>
    </section>
  );
}
