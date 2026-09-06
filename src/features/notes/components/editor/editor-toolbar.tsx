"use client";

import type { Editor } from "@tiptap/core";
import { Bold, Braces, CheckSquare, Italic, Link2, List, ListOrdered, Minus, Quote, Redo2, Strikethrough, Table2, Underline, Undo2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LinkDialog } from "@/features/notes/components/editor/link-dialog";
import { ToolbarButton } from "@/features/notes/components/editor/toolbar-button";

function ToolbarSeparator() {
  return <span className="mx-1 h-6 w-px shrink-0 bg-border" aria-hidden="true" />;
}

export function EditorToolbar({ editor }: { editor: Editor }) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const currentHeading = ([1, 2, 3] as const).find((level) => editor.isActive("heading", { level }));

  function setBlock(value: string) {
    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
      return;
    }

    const level = Number(value) as 1 | 2 | 3;
    editor.chain().focus().toggleHeading({ level }).run();
  }

  return (
    <>
      <div className="notiva-scrollbar sticky top-0 z-10 flex items-center overflow-x-auto border-b bg-background/90 px-2 py-2 shadow-sm backdrop-blur-sm" role="toolbar" aria-label="Rich text formatting">
        <label className="sr-only" htmlFor="editor-heading">Text style</label>
        <select
          id="editor-heading"
          className="h-9 w-32 shrink-0 rounded-md border-0 bg-transparent px-2 text-sm font-medium outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
          value={currentHeading ? String(currentHeading) : "paragraph"}
          onChange={(event) => setBlock(event.target.value)}
          aria-label="Text style"
        >
          <option value="paragraph">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>
        <ToolbarSeparator />
        <ToolbarButton label="Bold" isActive={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold /></ToolbarButton>
        <ToolbarButton label="Italic" isActive={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic /></ToolbarButton>
        <ToolbarButton label="Underline" isActive={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><Underline /></ToolbarButton>
        <ToolbarButton label="Strike through" isActive={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough /></ToolbarButton>
        <ToolbarSeparator />
        <ToolbarButton label="Bullet list" isActive={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List /></ToolbarButton>
        <ToolbarButton label="Numbered list" isActive={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered /></ToolbarButton>
        <ToolbarButton label="Checklist" isActive={editor.isActive("taskList")} onClick={() => editor.chain().focus().toggleTaskList().run()}><CheckSquare /></ToolbarButton>
        <ToolbarSeparator />
        <ToolbarButton label="Code block" isActive={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Braces /></ToolbarButton>
        <ToolbarButton label="Block quote" isActive={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote /></ToolbarButton>
        <ToolbarButton label="Horizontal divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus /></ToolbarButton>
        <ToolbarButton label={editor.isActive("link") ? "Edit link" : "Add link"} isActive={editor.isActive("link")} onClick={() => setLinkDialogOpen(true)}><Link2 /></ToolbarButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant={editor.isActive("table") ? "secondary" : "ghost"} size="icon" className="size-9 shrink-0" aria-label="Table actions" title="Table actions"><Table2 /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onSelect={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>Insert 3 × 3 table</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={!editor.can().addRowAfter()} onSelect={() => editor.chain().focus().addRowAfter().run()}>Add row below</DropdownMenuItem>
            <DropdownMenuItem disabled={!editor.can().deleteRow()} onSelect={() => editor.chain().focus().deleteRow().run()}>Delete row</DropdownMenuItem>
            <DropdownMenuItem disabled={!editor.can().addColumnAfter()} onSelect={() => editor.chain().focus().addColumnAfter().run()}>Add column right</DropdownMenuItem>
            <DropdownMenuItem disabled={!editor.can().deleteColumn()} onSelect={() => editor.chain().focus().deleteColumn().run()}>Delete column</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={!editor.can().deleteTable()} className="text-destructive focus:text-destructive" onSelect={() => editor.chain().focus().deleteTable().run()}>Delete table</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ToolbarSeparator />
        <ToolbarButton label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo2 /></ToolbarButton>
        <ToolbarButton label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 /></ToolbarButton>
      </div>
      {linkDialogOpen && <LinkDialog editor={editor} onOpenChange={setLinkDialogOpen} />}
    </>
  );
}
