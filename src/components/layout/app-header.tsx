"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Menu } from "lucide-react";

import { NotivaBrand } from "@/components/landing/notiva-brand";
import { Button } from "@/components/ui/button";

type AppHeaderProps = {
  onOpenMobileSidebar: () => void;
  sidebarVisible: boolean;
  onToggleSidebar: () => void;
};

export function AppHeader({ onOpenMobileSidebar, sidebarVisible, onToggleSidebar }: AppHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center border-b bg-background px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3 lg:hidden">
        <Button
          id="mobile-navigation-trigger"
          className="size-11 shrink-0 rounded-lg border bg-surface text-muted-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
          variant="ghost"
          size="icon"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation"
          aria-haspopup="dialog"
          title="Open navigation"
        >
          <Menu aria-hidden="true" />
        </Button>
        <NotivaBrand className="min-w-0 [&>span]:truncate" />
      </div>
      <Button
        className="hidden rounded-lg border bg-surface text-muted-foreground shadow-sm hover:bg-accent hover:text-accent-foreground lg:inline-flex"
        variant="ghost"
        size="sm"
        onClick={onToggleSidebar}
        aria-label={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
        title={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
      >
        {sidebarVisible ? <PanelLeftClose aria-hidden="true" /> : <PanelLeftOpen aria-hidden="true" />}
      </Button>
      <div className="ml-3 hidden lg:block">
        <p className="text-sm font-medium text-muted-foreground">Workspace</p>
        <h1 className="text-lg font-semibold tracking-tight">Your notes</h1>
      </div>
    </header>
  );
}
