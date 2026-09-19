"use client";

import { Activity, FileText, Users } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminRequestError } from "@/features/admin/components/admin-request-error";
import { useAdminDashboard } from "@/features/admin/hooks/use-admin";

const statDefinitions = [
  { key: "totalUsers", label: "Total Users", icon: Users },
  { key: "totalNotes", label: "Total Notes", icon: FileText },
  { key: "totalAiRequests", label: "Total AI Requests", icon: Activity },
] as const;

export function AdminStats() {
  const query = useAdminDashboard();

  if (query.isLoading) return <div className="grid gap-4 sm:grid-cols-3" aria-label="Loading dashboard statistics" aria-busy="true">{statDefinitions.map(({ label }) => <Skeleton key={label} className="h-36" />)}</div>;
  if (query.isError || !query.data) return <AdminRequestError error={query.error} onRetry={() => void query.refetch()} />;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {statDefinitions.map(({ icon: Icon, key, label }) => (
        <Card key={key} className="shadow-none">
          <CardHeader className="flex-row items-center gap-2 pb-4"><Icon className="size-4 text-muted-foreground" aria-hidden="true" /><p className="text-sm font-medium text-muted-foreground">{label}</p></CardHeader>
          <CardContent><p className="text-3xl font-semibold tabular-nums tracking-tight">{query.data[key].toLocaleString()}</p></CardContent>
        </Card>
      ))}
    </div>
  );
}
