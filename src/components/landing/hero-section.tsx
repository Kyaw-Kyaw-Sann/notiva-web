import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

const highlights = ["Focused note workspace", "AI suggestions stay optional", "Available on every screen"];

export function HeroSection() {
  return (
    <section className="border-b">
      <PageContainer className="py-14 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">A clearer place for your notes</p>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
              Keep ideas organized and writing in focus.
            </h1>
            <p className="mt-6 max-w-lg text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              Notiva brings writing, organization, history, and thoughtful AI assistance into one dependable workspace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg"><Link href="/register">Create your workspace <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link href="#product">Explore the product</Link></Button>
            </div>
            <ul className="mt-8 space-y-2.5 text-sm text-muted-foreground">
              {highlights.map((highlight) => (
                <li key={highlight} className="flex items-center gap-2.5"><Check className="size-4 text-primary" aria-hidden="true" />{highlight}</li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-xl border bg-surface p-1.5 shadow-card sm:p-2">
            <Image src="/DS1.png" alt="Notiva notes dashboard with note cards, sidebar counts, categories, search, filters, and view controls" width={1853} height={919} priority sizes="(max-width: 1024px) 94vw, 760px" className="h-auto w-full rounded-lg border" />
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
