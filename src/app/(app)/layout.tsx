import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { ProtectedRoute } from "@/features/auth/components/protected-route";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}
