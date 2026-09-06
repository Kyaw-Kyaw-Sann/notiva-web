"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type NotesSearchProps = {
  onChange: (query: string) => void;
  value: string;
};

export function NotesSearch({ onChange, value }: NotesSearchProps) {
  return (
    <div className="relative w-full sm:max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input value={value} onChange={(event) => onChange(event.target.value)} className="h-11 pl-9" placeholder="Search notes..." aria-label="Search notes" />
    </div>
  );
}
