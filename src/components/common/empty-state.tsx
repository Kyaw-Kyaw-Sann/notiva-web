import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = { icon?: LucideIcon; title: string; description?: string; action?: ReactNode };

function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) { return <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed bg-surface-muted p-6 text-center"><div className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">{Icon && <Icon className="size-5" />}</div><h3 className="mt-4 font-semibold">{title}</h3>{description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}{action && <div className="mt-4">{action}</div>}</div>; }

export { EmptyState };
