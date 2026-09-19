import { Check } from "lucide-react";
import Image from "next/image";

const benefits = [
  "Organize notes with categories, pinning, and favorites",
  "Write in a focused editor with reliable autosave",
  "Use AI suggestions only when they support your work",
];

export function AuthBrandPanel() {
  return (
    <aside className="hidden min-h-svh border-l bg-surface-muted/45 p-10 lg:flex lg:flex-col lg:justify-center xl:p-14" aria-label="About Notiva">
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">The Notiva workspace</p>
        <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
          Your notes, organized around the way you work.
        </h2>
        <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
          Capture ideas, keep important work close, and return to your thinking without unnecessary distractions.
        </p>

        <ul className="mt-7 grid gap-3 text-sm text-muted-foreground" aria-label="Notiva benefits">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2.5">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 overflow-hidden rounded-xl border bg-surface p-1.5 shadow-card">
          <Image
            src="/DS2.png"
            alt="Notiva note editor with focused writing and optional AI assistance"
            width={1866}
            height={918}
            sizes="(max-width: 1280px) 48vw, 720px"
            unoptimized
            className="h-auto w-full rounded-lg border"
          />
        </div>
      </div>
    </aside>
  );
}
