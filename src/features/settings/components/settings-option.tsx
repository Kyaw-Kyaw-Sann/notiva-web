import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type SettingsOptionProps = {
  active: boolean;
  description?: string;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
};

export function SettingsOption({ active, description, icon: Icon, label, onClick }: SettingsOptionProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex min-h-16 flex-1 flex-col items-center justify-center rounded-xl border bg-surface px-4 py-3 text-center text-sm transition-colors hover:border-primary/45 hover:bg-accent/50",
        active && "border-primary bg-primary/5 text-primary ring-1 ring-primary/20",
      )}
      aria-pressed={active}
      onClick={onClick}
    >
      <Icon className="mb-1.5 size-5" aria-hidden="true" />
      <span className="font-medium">{label}</span>
      {description && <span className="mt-0.5 text-xs text-muted-foreground">{description}</span>}
    </button>
  );
}
