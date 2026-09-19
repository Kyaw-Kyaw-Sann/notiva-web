import { Skeleton } from "@/components/ui/skeleton";

export function NotesDashboardSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Loading notes" aria-busy="true">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="min-h-72 rounded-xl border bg-card p-5 shadow-card">
          <div className="flex justify-between"><Skeleton className="size-7 rounded-md" /><Skeleton className="size-7 rounded-md" /></div>
          <Skeleton className="mt-5 h-5 w-3/4" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
          <Skeleton className="mt-2 h-4 w-2/3" />
          <Skeleton className="mt-12 h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
