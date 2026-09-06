"use client";

import { Users } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { LoadingState } from "@/components/common/loading-state";
import { AdminPagination } from "@/features/admin/components/admin-pagination";
import { AdminRequestError } from "@/features/admin/components/admin-request-error";
import { AdminUserSearch } from "@/features/admin/components/admin-user-search";
import { AdminUserTable } from "@/features/admin/components/admin-user-table";
import { useAdminUsers } from "@/features/admin/hooks/use-admin";

const pageSize = 20;

function readPage(value: string | null) {
  const page = Number(value);
  return Number.isSafeInteger(page) && page >= 0 ? page : 0;
}

export function AdminUsers() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(() => ({ search: searchParams.get("search")?.trim() ?? "", page: readPage(searchParams.get("page")), size: pageSize }), [searchParams]);
  const query = useAdminUsers(filters);

  function updateUrl(search: string, page: number) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (page > 0) params.set("page", String(page));
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  return (
    <section>
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-sm font-medium text-primary">Administration</p><h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Users</h1><p className="mt-2 text-sm text-muted-foreground">Review account metadata without exposing private user content.</p></div>
        <AdminUserSearch value={filters.search} onSearch={(search) => updateUrl(search, 0)} />
      </div>

      {query.isLoading && <LoadingState rows={6} />}
      {query.isError && <AdminRequestError error={query.error} onRetry={() => void query.refetch()} />}
      {!query.isLoading && !query.isError && query.data?.content.length === 0 && <EmptyState icon={Users} title={filters.search ? "No matching users" : "No users found"} description={filters.search ? "Try a different name or email address." : "User accounts will appear here when available."} />}
      {!query.isLoading && !query.isError && query.data && query.data.content.length > 0 && (
        <div className={query.isPlaceholderData ? "opacity-65" : undefined} aria-busy={query.isFetching}>
          <AdminUserTable users={query.data.content} />
          <AdminPagination page={query.data} onPageChange={(page) => updateUrl(filters.search, page)} />
        </div>
      )}
    </section>
  );
}
