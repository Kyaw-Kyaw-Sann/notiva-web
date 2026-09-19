import { Eye, Layers3, ShieldCheck } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";

const reasons = [
  { icon: Eye, title: "Clarity over clutter", description: "Notiva is a focused notes product, not a dashboard packed with distractions." },
  { icon: Layers3, title: "One connected workflow", description: "Writing, organization, history, and AI assistance live in a coherent workspace." },
  { icon: ShieldCheck, title: "You stay in control", description: "AI suggestions never overwrite your writing automatically, and your notes remain yours." },
];

export function WhyNotivaSection() {
  return (
    <section className="border-y bg-surface-muted/50 py-16 sm:py-20 lg:py-24">
      <PageContainer className="py-0">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Why Notiva</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Designed to help ideas stay useful</h2>
          <p className="mt-4 leading-7 text-muted-foreground">A thoughtful notes experience should reduce friction, respect your attention, and make returning to your work feel natural.</p>
        </div>
        <div className="mt-10 grid gap-8 border-t pt-8 md:grid-cols-3">
          {reasons.map(({ icon: Icon, title, description }) => (
            <article key={title}>
              <Icon className="size-5 text-primary" aria-hidden="true" />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
