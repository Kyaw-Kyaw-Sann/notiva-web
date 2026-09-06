"use client";

import { AlertCircle, LoaderCircle, Sparkles, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AiResultPreview } from "@/features/ai/components/ai-result-preview";
import { AiWritingActions } from "@/features/ai/components/ai-writing-actions";
import { useAiWriting } from "@/features/ai/hooks/use-ai-writing";
import type { AiSummaryLength, AiWritingAction, AiWritingCommand, AiWritingResult } from "@/features/ai/types/ai.types";
import type { NoteEditorSelection } from "@/features/notes/components/editor/note-editor";
import type { NoteCategory } from "@/features/notes/types/note.types";
import { normalizeApiError } from "@/lib/api";

type AiWritingPanelProps = {
  categories: NoteCategory[];
  disabled: boolean;
  documentKey: string;
  fullText: string;
  noteId: number;
  onApplyCategory: (categoryId: number) => void;
  onApplyTitle: (title: string) => void;
  onClose: () => void;
  onInsertBelow: (selection: NoteEditorSelection, text: string) => void;
  onReplace: (selection: NoteEditorSelection, text: string) => void;
  selection: NoteEditorSelection;
};

export function AiWritingPanel(props: AiWritingPanelProps) {
  const [customInstruction, setCustomInstruction] = useState("");
  const [summaryLength, setSummaryLength] = useState<AiSummaryLength>("SHORT");
  const [result, setResult] = useState<AiWritingResult | null>(null);
  const [lastCommand, setLastCommand] = useState<AiWritingCommand | null>(null);
  const [targetAtRequest, setTargetAtRequest] = useState(props.selection);
  const [documentKeyAtRequest, setDocumentKeyAtRequest] = useState(props.documentKey);
  const [localError, setLocalError] = useState<string | null>(null);
  const aiWriting = useAiWriting(props.noteId);
  const targetText = props.selection.hasSelection ? props.selection.text : props.fullText;
  const isResultStale = documentKeyAtRequest !== props.documentKey;

  async function run(command: AiWritingCommand) {
    setLocalError(null);
    setResult(null);
    setLastCommand(command);
    setTargetAtRequest(props.selection);
    setDocumentKeyAtRequest(props.documentKey);

    try {
      const generated = await aiWriting.mutateAsync(command);
      if (generated.kind === "category" && generated.categoryId !== null && !props.categories.some((category) => category.id === generated.categoryId)) {
        const matchingCategory = props.categories.find((category) => category.name.toLocaleLowerCase() === generated.categoryName?.toLocaleLowerCase());
        setResult({ ...generated, categoryId: matchingCategory?.id ?? null });
        return;
      }
      setResult(generated);
    } catch {
      // TanStack Query retains the normalized error for the retry state below.
    }
  }

  function runWriting(action: AiWritingAction, instruction: string | null = null) {
    if (!targetText.trim()) {
      setLocalError("Write or select some note text before using this action.");
      return;
    }
    void run({ type: "WRITE", payload: { action, selectedText: targetText, instruction } });
  }

  function clearResult() {
    setResult(null);
    setLocalError(null);
    aiWriting.reset();
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <header className="flex items-start justify-between gap-3 border-b px-5 py-4">
        <div><div className="flex items-center gap-2 font-semibold"><Sparkles className="size-4 text-primary" aria-hidden="true" />AI Writing</div><p className="mt-1 text-xs text-muted-foreground">Improve this note while keeping every change under your control.</p></div>
        <Button type="button" variant="ghost" size="icon" className="hidden size-8 xl:inline-flex" onClick={props.onClose} aria-label="Close AI Writing"><X aria-hidden="true" /></Button>
      </header>

      <div className="notiva-scrollbar min-h-0 flex-1 overflow-y-auto p-5">
        <div className="mb-5 rounded-lg bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
          {props.selection.hasSelection ? <><span className="font-medium text-primary">Selection targeted:</span> “{props.selection.text.slice(0, 90)}{props.selection.text.length > 90 ? "…" : ""}”</> : "No selection — actions use the full note."}
        </div>

        {props.disabled && <p className="mb-5 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs">Wait until the note shows Saved before running an AI action.</p>}
        {aiWriting.isPending && <div className="mb-5 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground" aria-live="polite"><LoaderCircle className="mb-3 size-6 animate-spin text-primary" aria-hidden="true" />Generating a preview…</div>}
        {(localError || aiWriting.isError) && !aiWriting.isPending && (
          <div className="mb-5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm" role="alert">
            <div className="flex gap-2 text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><p>{localError ?? normalizeApiError(aiWriting.error).message}</p></div>
            {lastCommand && !localError && <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => void run(lastCommand)}>Try again</Button>}
          </div>
        )}
        {result && !aiWriting.isPending && (
          <div className="mb-6">
            <AiResultPreview
              result={result}
              hasSelection={targetAtRequest.hasSelection}
              isStale={isResultStale}
              onApplyCategory={() => { if (result.kind === "category" && result.categoryId !== null) { props.onApplyCategory(result.categoryId); clearResult(); } }}
              onApplyTitle={() => { if (result.kind === "title") { props.onApplyTitle(result.text); clearResult(); } }}
              onCancel={clearResult}
              onInsertBelow={() => { if (result.kind === "text") { props.onInsertBelow(targetAtRequest, result.text); clearResult(); } }}
              onReplace={() => { if (result.kind === "text") { props.onReplace(targetAtRequest, result.text); clearResult(); } }}
              onRetry={() => { if (lastCommand) void run(lastCommand); }}
            />
          </div>
        )}

        <AiWritingActions
          customInstruction={customInstruction}
          disabled={props.disabled || aiWriting.isPending}
          onCustomInstructionChange={setCustomInstruction}
          onGenerateTitle={() => void run({ type: "GENERATE_TITLE" })}
          onRunCustom={() => runWriting("CUSTOM", customInstruction.trim())}
          onRunWriting={(action) => runWriting(action)}
          onSuggestCategory={() => void run({ type: "SUGGEST_CATEGORY" })}
          onSummarize={(length) => void run({ type: "SUMMARIZE", length })}
          summaryLength={summaryLength}
          onSummaryLengthChange={setSummaryLength}
        />
      </div>
    </div>
  );
}
