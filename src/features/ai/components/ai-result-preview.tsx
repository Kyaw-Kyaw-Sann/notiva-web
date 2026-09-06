"use client";

import { Check, Clipboard, CornerDownLeft, RefreshCw, Replace, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { AiWritingResult } from "@/features/ai/types/ai.types";

type AiResultPreviewProps = {
  hasSelection: boolean;
  isStale: boolean;
  onApplyCategory: () => void;
  onApplyTitle: () => void;
  onCancel: () => void;
  onInsertBelow: () => void;
  onReplace: () => void;
  onRetry: () => void;
  result: AiWritingResult;
};

export function AiResultPreview({ hasSelection, isStale, onApplyCategory, onApplyTitle, onCancel, onInsertBelow, onReplace, onRetry, result }: AiResultPreviewProps) {
  const [copied, setCopied] = useState(false);

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(result.kind === "category" ? result.categoryName ?? result.text : result.text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-xl border bg-surface p-4 shadow-card" aria-label="AI result preview">
      <div className="flex items-center justify-between gap-3">
        <div><p className="text-xs font-medium uppercase tracking-wide text-primary">AI preview</p><h3 className="mt-1 text-sm font-semibold capitalize">{result.label}</h3></div>
        <Button type="button" variant="ghost" size="icon" className="size-8" onClick={onCancel} aria-label="Cancel AI result"><X aria-hidden="true" /></Button>
      </div>

      {result.kind === "category" && result.categoryName && <p className="mt-4 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary">{result.categoryName}</p>}
      <div className="notiva-scrollbar mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg bg-surface-muted p-3 text-sm leading-6">{result.text}</div>

      {isStale && result.kind === "text" && (
        <p className="mt-3 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-foreground">The note changed after this result was generated. Generate again before applying it.</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {result.kind === "text" && (
          <>
            <Button type="button" size="sm" disabled={isStale} onClick={onReplace}><Replace aria-hidden="true" />{hasSelection ? "Replace selection" : "Replace note"}</Button>
            <Button type="button" size="sm" variant="outline" disabled={isStale} onClick={onInsertBelow}><CornerDownLeft aria-hidden="true" />Insert below</Button>
          </>
        )}
        {result.kind === "title" && <Button type="button" size="sm" onClick={onApplyTitle}><Check aria-hidden="true" />Use title</Button>}
        {result.kind === "category" && result.categoryId !== null && <Button type="button" size="sm" onClick={onApplyCategory}><Check aria-hidden="true" />Use category</Button>}
        <Button type="button" size="sm" variant="ghost" onClick={() => void copyResult()}>{copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}{copied ? "Copied" : "Copy"}</Button>
        <Button type="button" size="sm" variant="ghost" onClick={onRetry}><RefreshCw aria-hidden="true" />Retry</Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}><X aria-hidden="true" />Cancel</Button>
      </div>
    </section>
  );
}
