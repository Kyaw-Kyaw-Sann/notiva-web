import { FolderKanban, History, Search, Sparkles, Star, WandSparkles, type LucideIcon } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";

type Feature = { icon: LucideIcon; title: string; description: string };

const features: Feature[] = [
  { icon: FolderKanban, title: "Simple organization", description: "Group notes with categories and keep important ideas pinned or favorited." },
  { icon: Search, title: "Find what matters", description: "Search and filter your notes instead of digging through a crowded workspace." },
  { icon: WandSparkles, title: "Writing support", description: "Improve, shorten, expand, or refine selected text while you stay in control." },
  { icon: Sparkles, title: "Ask your notes", description: "Explore ideas through conversations scoped to one note or your full collection." },
  { icon: History, title: "Version history", description: "Review earlier note versions and restore the one you need with confidence." },
  { icon: Star, title: "Focused by design", description: "A calm interface keeps content prominent and secondary actions out of the way." },
];

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 py-16 sm:py-20 lg:py-24">
      <PageContainer className="py-0">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">Everything in its place</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Useful tools without the busywork</h2>
          <p className="mt-4 leading-7 text-muted-foreground">Notiva focuses on the workflows that make notes easier to write, organize, revisit, and understand.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-xl border bg-card p-5 shadow-card sm:p-6">
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary"><Icon className="size-5" /></span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
