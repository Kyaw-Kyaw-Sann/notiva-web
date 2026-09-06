"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ToolbarButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  isActive?: boolean;
  label: string;
  onClick: () => void;
};

export function ToolbarButton({ children, disabled, isActive, label, onClick }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant={isActive ? "secondary" : "ghost"}
      size="icon"
      className={cn("size-9 shrink-0", isActive && "text-primary")}
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      aria-pressed={isActive === undefined ? undefined : isActive}
      title={label}
    >
      {children}
    </Button>
  );
}
