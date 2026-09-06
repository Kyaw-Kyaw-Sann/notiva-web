"use client";

import { Archive, BotMessageSquare, Inbox, Pin, Star } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

type NavigationItem = {
  href?: string;
  label: string;
  icon: typeof Inbox;
};

const navigationItems: NavigationItem[] = [
  { href: "/notes", label: "All Notes", icon: Inbox },
  { href: "/notes?pinned=true", label: "Pinned", icon: Pin },
  { href: "/notes?favorite=true", label: "Favorites", icon: Star },
  { label: "AI Conversations", icon: BotMessageSquare },
  { href: "/trash", label: "Recycle Bin", icon: Archive },
];

type AppSidebarNavProps = {
  collapsed: boolean;
  onNavigate?: () => void;
};

export function AppSidebarNav({ collapsed, onNavigate }: AppSidebarNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex min-h-0 flex-1 flex-col px-3">
      <nav className="space-y-1" aria-label="Workspace navigation">
        {navigationItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/notes"
            ? pathname === "/notes" && !searchParams.get("pinned") && !searchParams.get("favorite")
            : href === "/notes?pinned=true"
              ? pathname === "/notes" && searchParams.get("pinned") === "true" && searchParams.get("favorite") !== "true"
              : href === "/notes?favorite=true"
                ? pathname === "/notes" && searchParams.get("favorite") === "true" && searchParams.get("pinned") !== "true"
                : href === pathname;
          const className = cn(
            "relative flex min-h-11 w-full touch-manipulation items-center rounded-lg px-3 text-sm font-medium transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            collapsed && "justify-center px-0",
            isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
          );
          const content = <>
            {isActive && !collapsed && <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-primary" aria-hidden="true" />}
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {!collapsed && <span className="ml-3 truncate">{label}</span>}
          </>;

          return (
            href ? (
              <Link key={label} href={href} onClick={onNavigate} className={className} aria-current={isActive ? "page" : undefined} title={collapsed ? label : undefined}>
                {content}
              </Link>
            ) : (
              <button key={label} type="button" disabled className={cn(className, "cursor-not-allowed opacity-50")} title="Available in Phase 19">
                {content}
              </button>
            )
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
