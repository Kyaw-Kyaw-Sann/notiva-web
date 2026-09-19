import { AdminStats } from "@/features/admin/components/admin-stats";

export function AdminDashboard() {
  return (
    <section>
      <div className="mb-8 border-b pb-6"><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Admin overview</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Review Notiva account and activity totals without exposing private note or conversation content.</p></div>
      <AdminStats />
    </section>
  );
}
