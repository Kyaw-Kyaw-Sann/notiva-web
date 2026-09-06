"use client";

import { ImagePlus, LoaderCircle, RotateCcw, X } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { ToolbarButton } from "@/features/notes/components/editor/toolbar-button";
import type { AppApiError } from "@/lib/api";

type ImageUploadProps = {
  disabled?: boolean;
  error: AppApiError | null;
  isUploading: boolean;
  onFiles: (files: File[]) => void;
  onRetry: () => void;
  progress: number | null;
};

export function ImageUpload({ disabled, error, isUploading, onFiles, onRetry, progress }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input ref={inputRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => { onFiles(Array.from(event.target.files ?? [])); event.currentTarget.value = ""; }} />
      <ToolbarButton label="Insert image" disabled={disabled || isUploading} onClick={() => inputRef.current?.click()}>
        {isUploading ? <LoaderCircle className="animate-spin" /> : <ImagePlus />}
      </ToolbarButton>
      {isUploading && <span className="ml-1 shrink-0 text-xs text-muted-foreground" aria-live="polite">Uploading{progress === null ? "…" : ` ${progress}%`}</span>}
      {error && (
        <span className="ml-1 flex shrink-0 items-center gap-1.5 rounded-md bg-destructive/8 px-1.5 py-1 text-xs text-destructive" role="alert">
          <span className="max-w-44 truncate">{error.message}</span>
          <Button type="button" variant="ghost" size="icon" className="size-6 text-destructive hover:text-destructive" onClick={onRetry} aria-label="Retry image upload" title="Retry image upload"><RotateCcw /></Button>
        </span>
      )}
    </>
  );
}

export function RemoveImageButton({ disabled, onRemove }: { disabled: boolean; onRemove: () => void }) {
  return <ToolbarButton label="Remove selected image" disabled={disabled} onClick={onRemove}><X /></ToolbarButton>;
}
