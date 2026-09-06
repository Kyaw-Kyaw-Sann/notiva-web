"use client";

import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TableKit } from "@tiptap/extension-table";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { forwardRef, useEffect, useImperativeHandle } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { EditorToolbar } from "@/features/notes/components/editor/editor-toolbar";
import { getEditorContent } from "@/features/notes/utils/editor-content";

export type EditorValue = {
  contentJson: string;
  plainText: string;
};

export type NoteEditorSelection = {
  from: number;
  hasSelection: boolean;
  text: string;
  to: number;
};

export type NoteEditorHandle = {
  insertBelow: (selection: NoteEditorSelection, text: string) => void;
  replaceTarget: (selection: NoteEditorSelection, text: string) => void;
};

type NoteEditorProps = {
  contentJson: string;
  disabled?: boolean;
  fallbackPlainText: string;
  onChange: (value: EditorValue) => void;
  onReadyPlainText: (plainText: string) => void;
  onSelectionChange?: (selection: NoteEditorSelection) => void;
  showToolbar?: boolean;
};

function getSelection(editor: NonNullable<ReturnType<typeof useEditor>>): NoteEditorSelection {
  const { from, to, empty } = editor.state.selection;

  return {
    from,
    hasSelection: !empty,
    text: empty ? "" : editor.state.doc.textBetween(from, to, "\n"),
    to,
  };
}

function toInlineContent(text: string) {
  return text.split("\n").flatMap((line, index) => [
    ...(index > 0 ? [{ type: "hardBreak" }] : []),
    ...(line ? [{ type: "text", text: line }] : []),
  ]);
}

function toDocumentContent(text: string) {
  return {
    type: "doc",
    content: text.split(/\n{2,}/).map((paragraph) => ({
      type: "paragraph",
      content: toInlineContent(paragraph),
    })),
  };
}

export const NoteEditor = forwardRef<NoteEditorHandle, NoteEditorProps>(function NoteEditor({ contentJson, disabled, fallbackPlainText, onChange, onReadyPlainText, onSelectionChange, showToolbar = true }, ref) {
  const initialContent = getEditorContent(contentJson, fallbackPlainText).content;
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      TableKit.configure({
        table: { resizable: false },
      }),
    ],
    content: initialContent,
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "notiva-editor-content notiva-scrollbar",
        "aria-label": "Note content",
      },
    },
    onCreate: ({ editor: currentEditor }) => {
      onReadyPlainText(currentEditor.getText({ blockSeparator: "\n" }));
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange({
        contentJson: JSON.stringify(currentEditor.getJSON()),
        plainText: currentEditor.getText({ blockSeparator: "\n" }),
      });
    },
    onSelectionUpdate: ({ editor: currentEditor }) => {
      onSelectionChange?.(getSelection(currentEditor));
    },
  });

  useImperativeHandle(ref, () => ({
    replaceTarget: (selection, text) => {
      if (!editor) return;

      if (selection.hasSelection) {
        editor.chain().focus().insertContentAt({ from: selection.from, to: selection.to }, toInlineContent(text)).run();
        return;
      }

      editor.commands.setContent(toDocumentContent(text));
      editor.commands.focus("end");
    },
    insertBelow: (selection, text) => {
      if (!editor) return;

      editor.chain().focus().setTextSelection(selection.to).insertContent([
        { type: "paragraph" },
        ...toDocumentContent(text).content,
      ]).run();
    },
  }), [editor]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [disabled, editor]);

  if (!editor) {
    return <div className="p-6 sm:p-8"><Skeleton className="h-[50vh] w-full" /></div>;
  }

  return (
    <div className="bg-background/20 focus-within:bg-background/35">
      {showToolbar && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
});
