import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(circle_at_top,oklch(0.92_0.07_280_/_0.7),transparent_68%)] dark:bg-[radial-gradient(circle_at_top,oklch(0.35_0.09_280_/_0.45),transparent_68%)]" />
      <PageContainer className="pb-16 pt-16 sm:pb-20 sm:pt-24 lg:pb-24 lg:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-5">Your notes, thoughtfully organized</Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            A calmer place to capture ideas and <span className="text-primary">think with clarity.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            Notiva brings focused writing, flexible organization, and helpful AI into one clean workspace—so your ideas stay useful, not scattered.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg"><Link href="/register">Start writing free <ArrowRight /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="#product">See how it works</Link></Button>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4 text-success" />Focused notes</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4 text-success" />AI-assisted writing</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4 text-success" />Responsive workspace</span>
          </div>
        </div>

        <div className="relative mx-auto mt-12 max-w-6xl sm:mt-16">
          <div className="absolute -inset-3 -z-10 rounded-[1.5rem] bg-primary/10 blur-2xl" />
          <div className="overflow-hidden rounded-xl border bg-surface p-1.5 shadow-overlay sm:rounded-2xl sm:p-2">
            <Image src="/UX1.png" alt="Notiva notes dashboard showing organized note cards, filters, categories, and navigation" width={1586} height={992} priority sizes="(max-width: 1280px) 94vw, 1152px" className="h-auto w-full rounded-lg border" />
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
