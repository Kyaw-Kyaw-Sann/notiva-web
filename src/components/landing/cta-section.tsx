import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <PageContainer className="py-0">
        <div className="relative overflow-hidden rounded-2xl border bg-primary px-6 py-12 text-center text-primary-foreground shadow-overlay sm:px-10 sm:py-16">
          <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full border border-primary-foreground/15" />
          <div className="pointer-events-none absolute -bottom-28 -left-16 size-64 rounded-full border border-primary-foreground/15" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Give your ideas a clearer home</h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-primary-foreground/80">Create your Notiva workspace and start turning scattered thoughts into organized, useful notes.</p>
            <Button asChild size="lg" variant="secondary" className="mt-7"><Link href="/register">Create your account <ArrowRight /></Link></Button>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
