"use client";

import { useCallback, useState, type ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const handleMobileOpenChange = useCallback((open: boolean) => setMobileSidebarOpen(open), []);

  return (
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
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          sidebarVisible={sidebarVisible}
          onToggleSidebar={() => setSidebarVisible((visible) => !visible)}
        />
        <main className="notiva-scrollbar min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
