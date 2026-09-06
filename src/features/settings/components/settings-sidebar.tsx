import { Bot, Columns3, LayoutGrid, LockKeyhole, Palette, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

export type SettingsSection = "profile" | "appearance" | "editor" | "notes-view" | "ai-usage" | "security";

const groups: { label: string; items: { id: SettingsSection; label: string; icon: typeof UserRound }[] }[] = [
  { label: "Account", items: [{ id: "profile", label: "Profile", icon: UserRound }] },
  {
    label: "Preferences",
    items: [
      { id: "appearance", label: "Appearance", icon: Palette },
      { id: "editor", label: "Editor", icon: Columns3 },
      { id: "notes-view", label: "Notes View", icon: LayoutGrid },
    ],
  },
  { label: "AI", items: [{ id: "ai-usage", label: "AI Usage", icon: Bot }] },
  { label: "Security", items: [{ id: "security", label: "Security & Privacy", icon: LockKeyhole }] },
];

export function SettingsSidebar({ active, onSelect }: { active: SettingsSection; onSelect: (section: SettingsSection) => void }) {
  return (
    <nav className="notiva-scrollbar flex gap-2 overflow-x-auto p-4 md:block md:overflow-y-auto md:p-5" aria-label="Settings sections">
      {groups.map((group) => (
        <div key={group.label} className="shrink-0 md:mb-6">
          <p className="mb-2 hidden px-2 text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground md:block">{group.label}</p>
          <div className="flex gap-1 md:block md:space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={cn(
                    "flex min-h-10 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:w-full",
                    active === item.id && "bg-primary/10 font-medium text-primary",
                  )}
                  aria-current={active === item.id ? "page" : undefined}
                  onClick={() => onSelect(item.id)}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
