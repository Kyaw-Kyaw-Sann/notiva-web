"use client";

import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TableKit } from "@tiptap/extension-table";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { EditorToolbar } from "@/features/notes/components/editor/editor-toolbar";
import { getEditorContent } from "@/features/notes/utils/editor-content";

type EditorValue = {
  contentJson: string;
  plainText: string;
};

type NoteEditorProps = {
  contentJson: string;
  disabled?: boolean;
  fallbackPlainText: string;
  onChange: (value: EditorValue) => void;
  onReadyPlainText: (plainText: string) => void;
  showToolbar?: boolean;
};

export function NoteEditor({ contentJson, disabled, fallbackPlainText, onChange, onReadyPlainText, showToolbar = true }: NoteEditorProps) {
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
  });

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
}
