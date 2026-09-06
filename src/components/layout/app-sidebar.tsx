"use client";

import { ChevronsLeft, ChevronsRight, FilePlus } from "lucide-react";

import { NotivaBrand } from "@/components/landing/notiva-brand";
import { Button } from "@/components/ui/button";
import { AppSidebarNav } from "@/components/layout/app-sidebar-nav";
import { AppUserMenu } from "@/components/layout/app-user-menu";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  collapsed: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
  onToggleCollapsed: () => void;
};

export function AppSidebar({ collapsed, mobile = false, onNavigate, onToggleCollapsed }: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "h-dvh shrink-0 flex-col bg-surface",
        mobile ? "flex w-full" : "hidden border-r lg:flex",
        !mobile && (collapsed ? "w-[72px]" : "w-72"),
      )}
      aria-label="Notiva workspace sidebar"
    >
      <div className={cn("flex h-16 items-center border-b px-4", collapsed ? "justify-center px-2" : "justify-between")}>
        {!collapsed && <NotivaBrand />}
        {!mobile && (!collapsed ? (
          <Button className="size-8 text-muted-foreground hover:text-foreground" variant="ghost" size="icon" onClick={onToggleCollapsed} aria-label="Collapse sidebar" title="Collapse sidebar">
            <ChevronsLeft className="size-4" aria-hidden="true" />
          </Button>
        ) : (
          <Button className="size-8 text-muted-foreground hover:text-foreground" variant="ghost" size="icon" onClick={onToggleCollapsed} aria-label="Expand sidebar" title="Expand sidebar">
            <ChevronsRight className="size-4" aria-hidden="true" />
          </Button>
        ))}
      </div>

      <div className="px-3 py-4">
        <Button className={cn("w-full shadow-none disabled:opacity-100", collapsed && "px-0")} disabled title="New notes will be available in Phase 13">
          <FilePlus aria-hidden="true" />
          {!collapsed && <span>New Note</span>}
        </Button>
      </div>

      <AppSidebarNav collapsed={collapsed} onNavigate={onNavigate} />
      <AppUserMenu collapsed={collapsed} />
    </aside>
  );
}
