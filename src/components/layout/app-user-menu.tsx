"use client";

import { LogOut, Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { SettingsDialog } from "@/features/settings/components/settings-dialog";

type AppUserMenuProps = {
  collapsed: boolean;
};

function getInitials(displayName: string) {
  return displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function AppUserMenu({ collapsed }: AppUserMenuProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { signOut, user } = useAuth();
  const displayName = user?.displayName ?? "Notiva user";
  const isDark = resolvedTheme === "dark";

  return (
    <div className="border-t bg-surface-muted/40 p-3">
      <Button
        variant="ghost"
        className="mb-2 w-full justify-start rounded-lg bg-surface hover:bg-accent"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        title={collapsed ? "Toggle color theme" : undefined}
        aria-label="Toggle color theme"
      >
        {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        {!collapsed && <span className="ml-1 text-sm">{isDark ? "Light mode" : "Dark mode"}</span>}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto w-full justify-start rounded-lg px-2 py-2 hover:bg-surface"
            aria-label="Open account menu"
          >
            <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary bg-cover bg-center text-xs font-semibold text-secondary-foreground" style={user?.avatarUrl ? { backgroundImage: `url(${JSON.stringify(user.avatarUrl)})` } : undefined} aria-hidden="true">
              {!user?.avatarUrl && getInitials(displayName)}
            </span>
            {!collapsed && (
              <span className="ml-3 min-w-0 text-left">
                <span className="block truncate text-sm font-medium">{displayName}</span>
                <span className="block truncate text-xs text-muted-foreground">{user?.email}</span>
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-60">
          <DropdownMenuLabel>
            <span className="block truncate">{displayName}</span>
            <span className="block truncate pt-0.5 text-xs font-normal">{user?.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setSettingsOpen(true)}>
            <Settings aria-hidden="true" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => void signOut()}>
            <LogOut aria-hidden="true" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
