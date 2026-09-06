import { Badge } from "@/components/ui/badge";
import type { AdminUser } from "@/features/admin/types/admin.types";

function getInitials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function formatCreatedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unavailable" : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function UserAvatar({ user }: { user: AdminUser }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary bg-cover bg-center text-xs font-semibold text-secondary-foreground" style={user.avatarUrl ? { backgroundImage: `url(${JSON.stringify(user.avatarUrl)})` } : undefined} aria-hidden="true">
      {!user.avatarUrl && getInitials(user.displayName)}
    </span>
  );
}

export function AdminUserTable({ users }: { users: AdminUser[] }) {
  return (
    <div className="notiva-scrollbar overflow-x-auto rounded-xl border bg-surface shadow-card">
      <table className="w-full min-w-[58rem] border-collapse text-left text-sm">
        <caption className="sr-only">Notiva users and documented account metadata</caption>
        <thead className="border-b bg-surface-muted/65 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-5 py-3 font-semibold" scope="col">User</th><th className="px-4 py-3 font-semibold" scope="col">Role</th><th className="px-4 py-3 font-semibold" scope="col">Plan</th><th className="px-4 py-3 font-semibold" scope="col">Account</th><th className="px-4 py-3 font-semibold" scope="col">Email</th><th className="px-5 py-3 font-semibold" scope="col">Created</th></tr></thead>
        <tbody className="divide-y">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-surface-muted/35">
              <td className="px-5 py-4"><div className="flex items-center gap-3"><UserAvatar user={user} /><div className="min-w-0"><p className="max-w-56 truncate font-medium">{user.displayName}</p><p className="max-w-56 truncate text-xs text-muted-foreground">{user.email}</p></div></div></td>
              <td className="px-4 py-4"><Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role}</Badge></td>
              <td className="px-4 py-4"><Badge variant="outline">{user.plan}</Badge></td>
              <td className="px-4 py-4"><Badge variant={user.enabled ? "success" : "destructive"}>{user.enabled ? "Enabled" : "Disabled"}</Badge></td>
              <td className="px-4 py-4"><Badge variant={user.emailVerified ? "success" : "warning"}>{user.emailVerified ? "Verified" : "Unverified"}</Badge></td>
              <td className="whitespace-nowrap px-5 py-4 text-muted-foreground"><time dateTime={user.createdAt}>{formatCreatedAt(user.createdAt)}</time></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
