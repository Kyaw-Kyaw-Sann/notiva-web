import type { ReactNode } from "react";

import { ProtectedRoute } from "@/features/auth/components/protected-route";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
