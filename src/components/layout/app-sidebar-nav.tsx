"use client";

import { Archive, BotMessageSquare, Inbox, Pin, Star } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { CategoryList } from "@/features/categories/components/category-list";
import { useAiConversations } from "@/features/ai/hooks/use-ai-conversations";
import { useNotes } from "@/features/notes/hooks/use-notes";
import type { NotesSearchFilters } from "@/features/notes/types/note.types";
import { cn } from "@/lib/utils";

type NavigationItem = {
  href?: string;
  label: string;
  icon: typeof Inbox;
  count?: number;
};

const countFilters: NotesSearchFilters = {
  page: 0,
  size: 1,
  sort: "UPDATED_DESC",
};

type AppSidebarNavProps = {
  collapsed: boolean;
  onNavigate?: () => void;
};

export function AppSidebarNav({ collapsed, onNavigate }: AppSidebarNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const allNotes = useNotes("all", countFilters);
  const pinnedNotes = useNotes("pinned", { ...countFilters, pinned: true });
  const favoriteNotes = useNotes("favorites", { ...countFilters, favorite: true });
  const trashedNotes = useNotes("trash", countFilters);
  const conversations = useAiConversations();
  const navigationItems: NavigationItem[] = [
    { href: "/notes", label: "All Notes", icon: Inbox, count: allNotes.data?.totalElements },
    { href: "/notes?pinned=true", label: "Pinned", icon: Pin, count: pinnedNotes.data?.totalElements },
    { href: "/notes?favorite=true", label: "Favorites", icon: Star, count: favoriteNotes.data?.totalElements },
    { href: "/ai", label: "AI Conversations", icon: BotMessageSquare, count: conversations.data?.length },
    { href: "/trash", label: "Recycle Bin", icon: Archive, count: trashedNotes.data?.totalElements },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col px-3">
      <nav className="space-y-1" aria-label="Workspace navigation">
        {navigationItems.map(({ href, label, icon: Icon, count }) => {
          const isActive = href === "/notes"
            ? (pathname.startsWith("/notes/") || (
              pathname === "/notes"
              && !searchParams.get("pinned")
              && !searchParams.get("favorite")
              && !searchParams.get("categoryId")
              && !searchParams.get("uncategorized")
            ))
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
            {!collapsed && count !== undefined && <span className="ml-auto pl-3 text-xs font-medium tabular-nums text-muted-foreground" aria-label={`${count} ${label.toLowerCase()}`}>{count}</span>}
          </>;

          return (
            href ? (
              <Link key={label} href={href} onClick={onNavigate} className={className} aria-current={isActive ? "page" : undefined} title={collapsed ? label : undefined}>
                {content}
              </Link>
            ) : null
          );
        })}
      </nav>

      <section className="mt-6 flex min-h-0 flex-1 flex-col border-t pt-5" aria-labelledby="categories-heading">
        <CategoryList collapsed={collapsed} onNavigate={onNavigate} />
      </section>
    </div>
  );
}
