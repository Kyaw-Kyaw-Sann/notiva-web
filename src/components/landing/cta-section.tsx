import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <PageContainer className="py-0">
        <div className="flex flex-col gap-7 rounded-xl border bg-primary px-6 py-10 text-primary-foreground sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Give your ideas a clearer home</h2>
            <p className="mt-3 max-w-xl leading-7 text-primary-foreground/80">Create your Notiva workspace and turn scattered thoughts into organized, useful notes.</p>
          </div>
          <Button asChild size="lg" variant="secondary" className="w-fit shrink-0"><Link href="/register">Create your account <ArrowRight /></Link></Button>
        </div>
      </PageContainer>
    </section>
  );
}
