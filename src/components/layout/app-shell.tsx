"use client";

import { useCallback, useState, type ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import type { NavigationLabel } from "@/components/layout/app-sidebar-nav";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const [activeItem, setActiveItem] = useState<NavigationLabel>("All Notes");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const handleMobileOpenChange = useCallback((open: boolean) => setMobileSidebarOpen(open), []);

  return (
    <div className="flex min-h-screen bg-background">
      {sidebarVisible && (
        <AppSidebar
          activeItem={activeItem}
          collapsed={sidebarCollapsed}
          onActiveItemChange={setActiveItem}
          onToggleCollapsed={() => setSidebarCollapsed((collapsed) => !collapsed)}
        />
      )}
      <MobileSidebar
        activeItem={activeItem}
        onActiveItemChange={setActiveItem}
        onOpenChange={handleMobileOpenChange}
        open={mobileSidebarOpen}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          sidebarVisible={sidebarVisible}
          onToggleSidebar={() => setSidebarVisible((visible) => !visible)}
        />
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
