"use client";

import { LayoutDashboard, LogOut, Menu, NotebookText, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { NotivaBrand } from "@/components/landing/notiva-brand";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const pathname = usePathname();
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <NotivaBrand />
          <span className="hidden rounded-full border bg-surface-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground sm:inline-flex">Admin</span>
          <nav className="ml-8 hidden items-center gap-1 md:flex" aria-label="Admin navigation">
            {navigation.map(({ href, icon: Icon, label }) => {
              const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
              return <Link key={href} href={href} className={cn("flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground", active && "bg-primary/10 text-primary")} aria-current={active ? "page" : undefined}><Icon className="size-4" />{label}</Link>;
            })}
          </nav>
          <div className="ml-auto hidden items-center gap-3 md:flex">
            <div className="text-right"><p className="max-w-44 truncate text-sm font-medium">{user?.displayName}</p><p className="text-xs text-muted-foreground">Administrator</p></div>
            <Button asChild variant="outline" size="sm"><Link href="/notes"><NotebookText />Workspace</Link></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => void signOut()} aria-label="Sign out"><LogOut /></Button>
          </div>
          <Button type="button" className="ml-auto md:hidden" variant="outline" size="icon" onClick={() => setNavigationOpen((open) => !open)} aria-expanded={navigationOpen} aria-controls="admin-mobile-navigation" aria-label={navigationOpen ? "Close admin navigation" : "Open admin navigation"}>{navigationOpen ? <X /> : <Menu />}</Button>
        </div>
        {navigationOpen && (
          <nav id="admin-mobile-navigation" className="border-t bg-surface px-4 py-3 md:hidden" aria-label="Mobile admin navigation">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {navigation.map(({ href, icon: Icon, label }) => {
                const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
                return <Link key={href} href={href} onClick={() => setNavigationOpen(false)} className={cn("flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground", active && "bg-primary/10 text-primary")} aria-current={active ? "page" : undefined}><Icon className="size-4" />{label}</Link>;
              })}
              <Link href="/notes" onClick={() => setNavigationOpen(false)} className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground"><NotebookText className="size-4" />Return to workspace</Link>
              <button type="button" className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-muted-foreground" onClick={() => void signOut()}><LogOut className="size-4" />Sign out</button>
            </div>
          </nav>
        )}
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
