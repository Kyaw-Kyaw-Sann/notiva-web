"use client";

import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { NoteBackgroundColor } from "@/features/notes/types/note.types";
import { cn } from "@/lib/utils";

const backgroundOptions: { className: string; label: string; value: NoteBackgroundColor }[] = [
  { value: "DEFAULT", label: "Default", className: "bg-note-default" },
  { value: "YELLOW", label: "Yellow", className: "bg-note-yellow" },
  { value: "GREEN", label: "Green", className: "bg-note-green" },
  { value: "BLUE", label: "Blue", className: "bg-note-blue" },
  { value: "PINK", label: "Pink", className: "bg-note-pink" },
  { value: "PURPLE", label: "Purple", className: "bg-note-purple" },
  { value: "GRAY", label: "Gray", className: "bg-note-gray" },
];

type NoteBackgroundPickerProps = {
  disabled?: boolean;
  onChange: (value: NoteBackgroundColor) => void;
  value: NoteBackgroundColor;
};

export function NoteBackgroundPicker({ disabled, onChange, value }: NoteBackgroundPickerProps) {
  const selectedOption = backgroundOptions.find((option) => option.value === value) ?? backgroundOptions[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="h-9 shrink-0 gap-2 bg-surface px-3" disabled={disabled} aria-label={`Note color: ${selectedOption.label}`}>
          <span className={cn("size-4 rounded-full border shadow-sm", selectedOption.className)} aria-hidden="true" />
          <span className="hidden sm:inline">Color</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto p-3">
        <p className="mb-3 text-xs font-medium text-muted-foreground">Note color</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Note background color">
          {backgroundOptions.map((option) => (
            <DropdownMenuItem key={option.value} asChild className="rounded-full p-0 focus:bg-transparent">
              <button
                type="button"
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border shadow-sm transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  option.className,
                  value === option.value && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                )}
                onClick={() => onChange(option.value)}
                aria-label={`${option.label} background`}
                aria-pressed={value === option.value}
              >
                {value === option.value && <Check className="size-3.5" aria-hidden="true" />}
              </button>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
