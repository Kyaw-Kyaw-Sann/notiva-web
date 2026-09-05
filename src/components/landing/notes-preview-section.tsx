import { Bot, FileText, Save, TextCursorInput } from "lucide-react";
import Image from "next/image";

import { PageContainer } from "@/components/layout/page-container";

const editorPoints = [
  { icon: TextCursorInput, text: "A focused rich-text workspace" },
  { icon: Save, text: "Clear save status and note metadata" },
  { icon: Bot, text: "Optional AI beside your writing" },
];

export function NotesPreviewSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <PageContainer className="py-0">
        <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
          <div className="overflow-hidden rounded-2xl border bg-surface p-2 shadow-overlay sm:p-3"><Image src="/UX2.png" alt="Notiva rich-text note editor with an optional AI conversation panel" width={1586} height={992} sizes="(max-width: 1024px) 94vw, 720px" className="h-auto w-full rounded-lg border" /></div>
          <div>
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary"><FileText className="size-5" /></span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">A writing space made for focus</h2>
            <p className="mt-4 leading-7 text-muted-foreground">Keep the editor at the center of your work. Formatting, organization, save feedback, and AI support stay available without crowding the page.</p>
            <ul className="mt-7 space-y-3">
              {editorPoints.map(({ icon: Icon, text }) => <li key={text} className="flex items-center gap-3 text-sm"><span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary"><Icon className="size-4" /></span>{text}</li>)}
            </ul>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
