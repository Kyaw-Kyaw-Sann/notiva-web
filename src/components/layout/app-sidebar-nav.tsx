"use client";

import { Archive, BotMessageSquare, Inbox, Pin, Star } from "lucide-react";

import { cn } from "@/lib/utils";

export type NavigationLabel = "All Notes" | "Pinned" | "Favorites" | "AI Conversations" | "Recycle Bin";

type NavigationItem = {
  label: NavigationLabel;
  icon: typeof Inbox;
};

const navigationItems: NavigationItem[] = [
  { label: "All Notes", icon: Inbox },
  { label: "Pinned", icon: Pin },
  { label: "Favorites", icon: Star },
  { label: "AI Conversations", icon: BotMessageSquare },
  { label: "Recycle Bin", icon: Archive },
];

type AppSidebarNavProps = {
  activeItem: NavigationLabel;
  collapsed: boolean;
  onActiveItemChange: (item: NavigationLabel) => void;
  onNavigate?: () => void;
};

export function AppSidebarNav({ activeItem, collapsed, onActiveItemChange, onNavigate }: AppSidebarNavProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col px-3">
      <nav className="space-y-1" aria-label="Workspace navigation">
        {navigationItems.map(({ label, icon: Icon }) => {
          const isActive = activeItem === label;

          return (
            <button
              key={label}
              type="button"
              onClick={() => {
                onActiveItemChange(label);
                onNavigate?.();
              }}
              className={cn(
                "relative flex min-h-11 w-full touch-manipulation items-center rounded-lg px-3 text-sm font-medium transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                collapsed && "justify-center px-0",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? label : undefined}
            >
              {isActive && !collapsed && <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-primary" aria-hidden="true" />}
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {!collapsed && <span className="ml-3 truncate">{label}</span>}
            </button>
          );
        })}
      </nav>

      <section className="mt-6 flex min-h-0 flex-1 flex-col border-t pt-5" aria-labelledby="categories-heading">
        <div className={cn("flex items-center justify-between px-3", collapsed && "justify-center px-0")}>
          {!collapsed && <h2 id="categories-heading" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categories</h2>}
          {collapsed && <span className="sr-only" id="categories-heading">Categories</span>}
        </div>
        <div className="mt-3 min-h-0 flex-1 overflow-y-auto px-3 pb-3" aria-labelledby="categories-heading">
          {!collapsed && <p className="text-xs leading-5 text-muted-foreground">Your categories will appear here in Phase 12.</p>}
        </div>
      </section>
    </div>
  );
}
