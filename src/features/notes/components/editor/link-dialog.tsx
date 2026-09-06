"use client";

import type { Editor } from "@tiptap/core";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LinkDialogProps = {
  editor: Editor;
  onOpenChange: (open: boolean) => void;
};

function normalizeLink(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const candidate = /^[a-z][a-z\d+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol) ? candidate : undefined;
  } catch {
    return undefined;
  }
}

export function LinkDialog({ editor, onOpenChange }: LinkDialogProps) {
  const [value, setValue] = useState(() => String(editor.getAttributes("link").href ?? ""));
  const [error, setError] = useState<string | null>(null);
  const hasLink = editor.isActive("link");

  function applyLink() {
    const href = normalizeLink(value);
    if (href === undefined) {
      setError("Enter a valid web, email, or telephone link.");
      return;
    }

    if (href === null) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }
    onOpenChange(false);
  }

  function removeLink() {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    onOpenChange(false);
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{hasLink ? "Edit link" : "Add link"}</DialogTitle>
          <DialogDescription>Add a secure destination to the selected text.</DialogDescription>
        </DialogHeader>
        <div className="mt-5 space-y-2">
          <Label htmlFor="editor-link">Link address</Label>
          <Input
            id="editor-link"
            autoFocus
            value={value}
            onChange={(event) => { setValue(event.target.value); setError(null); }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applyLink();
              }
            }}
            placeholder="https://example.com"
            aria-invalid={Boolean(error)}
          />
          {error && <p className="text-xs text-destructive" role="alert">{error}</p>}
        </div>
        <DialogFooter>
          {hasLink && <Button type="button" variant="ghost" className="sm:mr-auto" onClick={removeLink}>Remove link</Button>}
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="button" onClick={applyLink}>Apply link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
