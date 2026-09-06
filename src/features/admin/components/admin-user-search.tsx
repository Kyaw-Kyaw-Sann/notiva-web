"use client";

import { Search, X } from "lucide-react";
import { type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminUserSearch({ value, onSearch }: { value: string; onSearch: (value: string) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSearch(String(data.get("search") ?? "").trim());
  }

  return (
    <form className="flex w-full gap-2 sm:max-w-md" onSubmit={submit} role="search">
      <Label className="sr-only" htmlFor="admin-user-search">Search users</Label>
      <div className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input key={value} id="admin-user-search" name="search" type="search" defaultValue={value} placeholder="Search name or email…" className="pl-9" /></div>
      {value && <Button type="button" variant="ghost" size="icon" onClick={() => onSearch("")} aria-label="Clear user search"><X /></Button>}
      <Button type="submit" variant="outline">Search</Button>
    </form>
  );
}
