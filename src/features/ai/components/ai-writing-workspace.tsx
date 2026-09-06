"use client";

import { useSyncExternalStore } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AiWritingPanel } from "@/features/ai/components/ai-writing-panel";
import type { NoteEditorSelection } from "@/features/notes/components/editor/note-editor";
import type { NoteCategory } from "@/features/notes/types/note.types";

type AiWritingWorkspaceProps = {
  categories: NoteCategory[];
  disabled: boolean;
  documentKey: string;
  fullText: string;
  noteId: number;
  onApplyCategory: (categoryId: number) => void;
  onApplyTitle: (title: string) => void;
  onInsertBelow: (selection: NoteEditorSelection, text: string) => void;
  onOpenChange: (open: boolean) => void;
  onReplace: (selection: NoteEditorSelection, text: string) => void;
  open: boolean;
  selection: NoteEditorSelection;
};

const desktopQuery = "(min-width: 1280px)";

function subscribeToDesktop(callback: () => void) {
  const mediaQuery = window.matchMedia(desktopQuery);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getDesktopSnapshot() {
  return window.matchMedia(desktopQuery).matches;
}

function getServerDesktopSnapshot() {
  return false;
}

export function AiWritingWorkspace(props: AiWritingWorkspaceProps) {
  const isDesktop = useSyncExternalStore(subscribeToDesktop, getDesktopSnapshot, getServerDesktopSnapshot);
  const panel = <AiWritingPanel {...props} onClose={() => props.onOpenChange(false)} />;

  if (!props.open) return null;

  if (isDesktop) {
    return <aside className="sticky top-5 h-[calc(100vh-2.5rem)] min-h-[36rem] overflow-hidden rounded-2xl border bg-background shadow-card" aria-label="AI Writing assistant">{panel}</aside>;
  }

  return (
    <Dialog open onOpenChange={props.onOpenChange}>
      <DialogContent className="left-0 top-0 h-dvh w-full max-w-none translate-x-0 translate-y-0 overflow-hidden rounded-none border-0 p-0 md:left-auto md:right-0 md:w-[28rem] md:border-l">
        <DialogTitle className="sr-only">AI Writing assistant</DialogTitle>
        {panel}
      </DialogContent>
    </Dialog>
  );
}
