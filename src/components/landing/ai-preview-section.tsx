import { BrainCircuit, MessageSquareText, Sparkles } from "lucide-react";
import Image from "next/image";

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";

export function AiPreviewSection() {
  return (
    <section className="border-y bg-surface-muted/50 py-16 sm:py-20 lg:py-24">
      <PageContainer className="py-0">
        <div className="grid items-center gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
          <div>
            <Badge variant="secondary"><Sparkles />AI that works with your notes</Badge>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Turn your knowledge into a conversation</h2>
            <p className="mt-4 leading-7 text-muted-foreground">Summarize a note, improve a passage, or ask questions across your workspace. Generated writing stays a suggestion until you choose to use it.</p>
            <ul className="mt-7 space-y-4">
              <li className="flex gap-3"><BrainCircuit className="mt-0.5 size-5 shrink-0 text-primary" /><div><p className="font-medium">Understand faster</p><p className="mt-1 text-sm text-muted-foreground">Surface summaries and connections from the notes you own.</p></div></li>
              <li className="flex gap-3"><MessageSquareText className="mt-0.5 size-5 shrink-0 text-primary" /><div><p className="font-medium">Stay in context</p><p className="mt-1 text-sm text-muted-foreground">Keep conversations attached to one note or ask across all notes.</p></div></li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-2xl border bg-surface p-2 shadow-overlay sm:p-3"><Image src="/ss3.png" alt="Notiva AI workspace for asking questions across notes" width={1876} height={904} sizes="(max-width: 1024px) 94vw, 720px" className="h-auto w-full rounded-lg border" /></div>
        </div>
      </PageContainer>
    </section>
  );
}
