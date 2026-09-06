import type { ReactNode } from "react";

import { AdminRoute } from "@/features/admin/components/admin-route";
import { AdminShell } from "@/features/admin/components/admin-shell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminRoute><AdminShell>{children}</AdminShell></AdminRoute>;
}
