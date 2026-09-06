"use client";

import { FileText, Heading1, ListRestart, Sparkles, Tags, WandSparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AiSummaryLength, AiWritingAction } from "@/features/ai/types/ai.types";

const writingActions: { action: Exclude<AiWritingAction, "CUSTOM">; label: string }[] = [
  { action: "IMPROVE", label: "Improve writing" },
  { action: "FIX_GRAMMAR", label: "Fix grammar" },
  { action: "SHORTEN", label: "Shorten" },
  { action: "EXPAND", label: "Expand" },
  { action: "PROFESSIONAL", label: "Professional tone" },
  { action: "CONTINUE", label: "Continue writing" },
];

type AiWritingActionsProps = {
  customInstruction: string;
  disabled: boolean;
  onCustomInstructionChange: (value: string) => void;
  onGenerateTitle: () => void;
  onRunCustom: () => void;
  onRunWriting: (action: Exclude<AiWritingAction, "CUSTOM">) => void;
  onSuggestCategory: () => void;
  onSummarize: (length: AiSummaryLength) => void;
  summaryLength: AiSummaryLength;
  onSummaryLengthChange: (length: AiSummaryLength) => void;
};

export function AiWritingActions(props: AiWritingActionsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant="outline" className="h-auto justify-start py-3" disabled={props.disabled} onClick={props.onGenerateTitle}><Heading1 aria-hidden="true" />Generate title</Button>
        <Button type="button" variant="outline" className="h-auto justify-start py-3" disabled={props.disabled} onClick={props.onSuggestCategory}><Tags aria-hidden="true" />Suggest category</Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ai-summary-length">Summarize note</Label>
        <div className="flex gap-2">
          <select id="ai-summary-length" className="h-10 min-w-0 flex-1 rounded-md border bg-surface px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring" value={props.summaryLength} disabled={props.disabled} onChange={(event) => props.onSummaryLengthChange(event.target.value as AiSummaryLength)}>
            <option value="SHORT">Short</option>
            <option value="MEDIUM">Medium</option>
            <option value="DETAILED">Detailed</option>
          </select>
          <Button type="button" variant="secondary" disabled={props.disabled} onClick={() => props.onSummarize(props.summaryLength)}><FileText aria-hidden="true" />Summarize</Button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Writing tools</p>
        <div className="grid grid-cols-2 gap-2">
          {writingActions.map((item) => (
            <Button key={item.action} type="button" variant="ghost" className="h-auto justify-start border px-3 py-2.5 text-left" disabled={props.disabled} onClick={() => props.onRunWriting(item.action)}>
              {item.action === "CONTINUE" ? <ListRestart aria-hidden="true" /> : <Sparkles aria-hidden="true" />}
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ai-custom-instruction">Custom instruction</Label>
        <Textarea id="ai-custom-instruction" rows={3} value={props.customInstruction} disabled={props.disabled} maxLength={500} placeholder="For example: Rewrite this as a clear project update." onChange={(event) => props.onCustomInstructionChange(event.target.value)} />
        <Button type="button" className="w-full" disabled={props.disabled || !props.customInstruction.trim()} onClick={props.onRunCustom}><WandSparkles aria-hidden="true" />Generate</Button>
      </div>
    </div>
  );
}
