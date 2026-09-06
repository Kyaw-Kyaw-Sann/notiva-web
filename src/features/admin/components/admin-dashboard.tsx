import { AdminStats } from "@/features/admin/components/admin-stats";

export function AdminDashboard() {
  return (
    <section>
      <div className="mb-7"><p className="text-sm font-medium text-primary">Administration</p><h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Dashboard</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">A privacy-conscious overview of Notiva activity. Individual note and conversation content is never exposed here.</p></div>
      <AdminStats />
    </section>
  );
}
