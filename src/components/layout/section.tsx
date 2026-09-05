import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionProps = { title?: string; description?: string; actions?: ReactNode; children: ReactNode; className?: string };

function Section({ title, description, actions, children, className }: SectionProps) {
  return <section className={cn("space-y-5 sm:space-y-6", className)}>{(title || description || actions) && <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div>{title && <h2 className="text-xl font-semibold tracking-tight">{title}</h2>}{description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}</div>{actions && <div className="shrink-0">{actions}</div>}</div>}{children}</section>;
}

export { Section };
