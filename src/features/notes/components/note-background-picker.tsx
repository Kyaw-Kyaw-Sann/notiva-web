"use client";

import { Check } from "lucide-react";

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
  return (
    <fieldset disabled={disabled}>
      <legend className="mb-2 text-xs font-medium text-muted-foreground">Note color</legend>
      <div className="flex flex-wrap gap-2">
        {backgroundOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={cn(
              "flex size-8 items-center justify-center rounded-full border shadow-sm transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              option.className,
              value === option.value && "ring-2 ring-primary ring-offset-2 ring-offset-background",
            )}
            onClick={() => onChange(option.value)}
            aria-label={`${option.label} background`}
            aria-pressed={value === option.value}
          >
            {value === option.value && <Check className="size-3.5" aria-hidden="true" />}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
