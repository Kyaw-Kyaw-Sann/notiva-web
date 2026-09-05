import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

type ErrorStateProps = { title?: string; description?: string; action?: ReactNode };

function ErrorState({ title = "Something went wrong", description = "Please try again.", action }: ErrorStateProps) { return <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-destructive/25 bg-destructive/5 p-6 text-center"><AlertCircle className="size-6 text-destructive" /><h3 className="mt-3 font-semibold">{title}</h3><p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>{action && <div className="mt-4">{action}</div>}</div>; }

export { ErrorState };
