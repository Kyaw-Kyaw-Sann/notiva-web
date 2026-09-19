"use client";

import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState, type ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppShellProvider } from "@/components/layout/app-shell-context";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const handleMobileOpenChange = useCallback((open: boolean) => setMobileSidebarOpen(open), []);
  const toggleSidebar = useCallback(() => setSidebarVisible((visible) => !visible), []);
  const shellContext = useMemo(() => ({ sidebarVisible, toggleSidebar }), [sidebarVisible, toggleSidebar]);
  const isEditorRoute = pathname === "/notes/new" || /^\/notes\/\d+$/.test(pathname);

  return (
    <AppShellProvider value={shellContext}>
    <div className="flex h-dvh overflow-hidden bg-background">
      {sidebarVisible && (
        <AppSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed((collapsed) => !collapsed)}
        />
      )}
      <MobileSidebar
        onOpenChange={handleMobileOpenChange}
        open={mobileSidebarOpen}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AppHeader
          className={isEditorRoute ? "lg:hidden" : undefined}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          sidebarVisible={sidebarVisible}
          onToggleSidebar={toggleSidebar}
        />
        <main className={cn("notiva-scrollbar min-h-0 min-w-0 flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10", isEditorRoute ? "py-3 sm:py-4 lg:py-4" : "py-8")}>{children}</main>
      </div>
    </div>
    </AppShellProvider>
  );
}
