"use client";

import { createContext, useContext, type ReactNode } from "react";

type AppShellContextValue = {
  sidebarVisible: boolean;
  toggleSidebar: () => void;
};

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function AppShellProvider({ children, value }: { children: ReactNode; value: AppShellContextValue }) {
  return <AppShellContext.Provider value={value}>{children}</AppShellContext.Provider>;
}

export function useAppShell() {
  const context = useContext(AppShellContext);

  if (!context) throw new Error("useAppShell must be used within AppShellProvider.");
  return context;
}
