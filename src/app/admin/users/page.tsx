import { Suspense } from "react";

import { LoadingState } from "@/components/common/loading-state";
import { AdminUsers } from "@/features/admin/components/admin-users";

export default function AdminUsersPage() {
  return <Suspense fallback={<LoadingState rows={6} />}><AdminUsers /></Suspense>;
}
