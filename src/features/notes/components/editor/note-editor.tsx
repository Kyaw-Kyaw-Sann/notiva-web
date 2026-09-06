"use client";

import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TableKit } from "@tiptap/extension-table";
import Image from "@tiptap/extension-image";
import type { Editor } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { deleteNoteImage } from "@/features/images/api/note-images-api";
import { useNoteImageUpload } from "@/features/images/hooks/use-note-image-upload";
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
  savedContentJson?: string;
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

const NotivaImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      publicId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-public-id"),
        renderHTML: (attributes) => attributes.publicId ? { "data-public-id": attributes.publicId } : {},
      },
    };
  },
});

function getImagePublicIds(value: unknown) {
  const publicIds = new Set<string>();

  function visit(node: unknown) {
    if (typeof node !== "object" || node === null) return;
    const candidate = node as Record<string, unknown>;
    const attributes = candidate.attrs;

    if (candidate.type === "image" && typeof attributes === "object" && attributes !== null) {
      const publicId = (attributes as Record<string, unknown>).publicId;
      if (typeof publicId === "string" && publicId) publicIds.add(publicId);
    }

    if (Array.isArray(candidate.content)) candidate.content.forEach(visit);
  }

  visit(value);
  return publicIds;
}

export const NoteEditor = forwardRef<NoteEditorHandle, NoteEditorProps>(function NoteEditor({ contentJson, disabled, fallbackPlainText, onChange, onReadyPlainText, onSelectionChange, savedContentJson, showToolbar = true }, ref) {
  const initialContent = getEditorContent(contentJson, fallbackPlainText).content;
  const pendingImagePublicIdsRef = useRef(new Set<string>());
  const cleanupInFlightRef = useRef(new Set<string>());
  const editorInstanceRef = useRef<Editor | null>(null);
  const uploadFilesRef = useRef<(files: File[]) => void>(() => undefined);
  const cleanupOrphanRef = useRef<(publicId: string) => void>(() => undefined);
  const { error: uploadError, isUploading, progress, retry, upload } = useNoteImageUpload();

  const cleanupOrphan = useCallback(async (publicId: string) => {
    if (!pendingImagePublicIdsRef.current.has(publicId) || cleanupInFlightRef.current.has(publicId)) return;

    cleanupInFlightRef.current.add(publicId);
    try {
      await deleteNoteImage(publicId);
      pendingImagePublicIdsRef.current.delete(publicId);
    } catch {
      // Preserve the ID for another safe cleanup attempt when this editor unmounts.
    } finally {
      cleanupInFlightRef.current.delete(publicId);
    }
  }, []);

  const uploadFiles = useCallback(async (files: File[]) => {
    const currentEditor = editorInstanceRef.current;
    if (!currentEditor || disabled) return;

    for (const file of files) {
      try {
        const uploadedImage = await upload(file);
        pendingImagePublicIdsRef.current.add(uploadedImage.publicId);
        const inserted = currentEditor.chain().focus().insertContent({
          type: "image",
          attrs: { src: uploadedImage.url, publicId: uploadedImage.publicId, alt: file.name },
        }).run();

        if (!inserted) {
          void cleanupOrphan(uploadedImage.publicId);
          return;
        }
      } catch {
        return;
      }
    }
  }, [cleanupOrphan, disabled, upload]);

  const retryImageUpload = useCallback(async () => {
    try {
      const uploadedImage = await retry();
      const currentEditor = editorInstanceRef.current;
      if (!uploadedImage || !currentEditor) return;

      pendingImagePublicIdsRef.current.add(uploadedImage.publicId);
      const inserted = currentEditor.chain().focus().insertContent({
        type: "image",
        attrs: { src: uploadedImage.url, publicId: uploadedImage.publicId, alt: "Uploaded image" },
      }).run();

      if (!inserted) void cleanupOrphan(uploadedImage.publicId);
    } catch {
      // The retry error remains available in the toolbar state.
    }
  }, [cleanupOrphan, retry]);

  useEffect(() => {
    uploadFilesRef.current = uploadFiles;
    cleanupOrphanRef.current = cleanupOrphan;
  }, [cleanupOrphan, uploadFiles]);

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
      NotivaImage.configure({ allowBase64: false }),
    ],
    content: initialContent,
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "notiva-editor-content notiva-scrollbar",
        "aria-label": "Note content",
      },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []);
        if (files.length === 0) return false;

        event.preventDefault();
        uploadFilesRef.current(files);
        return true;
      },
      handleDrop: (_view, event, _slice, moved) => {
        if (moved) return false;
        const files = Array.from(event.dataTransfer?.files ?? []);
        if (files.length === 0) return false;

        event.preventDefault();
        uploadFilesRef.current(files);
        return true;
      },
    },
    onCreate: ({ editor: currentEditor }) => {
      editorInstanceRef.current = currentEditor;
      onReadyPlainText(currentEditor.getText({ blockSeparator: "\n" }));
    },
    onUpdate: ({ editor: currentEditor }) => {
      const editorJson = currentEditor.getJSON();
      onChange({
        contentJson: JSON.stringify(editorJson),
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
    editorInstanceRef.current = editor;
    return () => {
      if (editorInstanceRef.current === editor) editorInstanceRef.current = null;
    };
  }, [editor]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!savedContentJson) return;

    try {
      const savedImageIds = getImagePublicIds(JSON.parse(savedContentJson));
      pendingImagePublicIdsRef.current.forEach((publicId) => {
        if (savedImageIds.has(publicId)) pendingImagePublicIdsRef.current.delete(publicId);
        else void cleanupOrphanRef.current(publicId);
      });
    } catch {
      // An invalid saved document is not a signal to delete a remote image.
    }
  }, [savedContentJson]);

  useEffect(() => () => {
    pendingImagePublicIdsRef.current.forEach((publicId) => cleanupOrphanRef.current(publicId));
  }, []);

  if (!editor) {
    return <div className="p-6 sm:p-8"><Skeleton className="h-[50vh] w-full" /></div>;
  }

  return (
    <div className="bg-background/20 focus-within:bg-background/35">
      {showToolbar && <EditorToolbar editor={editor} imageUpload={{ error: uploadError, isUploading, onFiles: (files) => void uploadFiles(files), onRetry: () => void retryImageUpload(), progress }} />}
      <EditorContent editor={editor} />
    </div>
  );
});
