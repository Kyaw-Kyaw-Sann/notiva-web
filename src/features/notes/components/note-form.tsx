"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, LoaderCircle, MessageCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AiWritingWorkspace } from "@/features/ai/components/ai-writing-workspace";
import { NoteChatWorkspace } from "@/features/ai/components/note-chat-workspace";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { NoteEditor, type NoteEditorHandle, type NoteEditorSelection } from "@/features/notes/components/editor/note-editor";
import { SaveStatus } from "@/features/notes/components/editor/save-status";
import { NoteActions } from "@/features/notes/components/note-actions";
import { NoteBackgroundPicker } from "@/features/notes/components/note-background-picker";
import { useNoteAutosave, useUnsavedChangesWarning } from "@/features/notes/hooks/use-note-autosave";
import { useCreateNote } from "@/features/notes/hooks/use-notes";
import { noteSchema, type NoteFormValues } from "@/features/notes/schemas/note.schema";
import type { Note, NoteBackgroundColor, NotePayload } from "@/features/notes/types/note.types";
import { getEditorContent } from "@/features/notes/utils/editor-content";
import { formatNoteUpdatedAt } from "@/features/notes/utils/format-note-updated-at";
import { normalizeApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

const noteBackgroundClasses: Record<NoteBackgroundColor, string> = {
  DEFAULT: "bg-note-default",
  YELLOW: "bg-note-yellow",
  GREEN: "bg-note-green",
  BLUE: "bg-note-blue",
  PINK: "bg-note-pink",
  PURPLE: "bg-note-purple",
  GRAY: "bg-note-gray",
};

function getDefaultValues(note?: Note): NoteFormValues {
  const editorContent = getEditorContent(note?.contentJson, note?.plainText ?? "");

  return {
    title: note?.title ?? "",
    contentJson: editorContent.contentJson,
    plainText: note?.plainText ?? "",
    categoryId: note?.category?.id ?? null,
    backgroundColor: note?.backgroundColor ?? "DEFAULT",
  };
}

export function NoteForm({ note }: { note?: Note }) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editorRevision, setEditorRevision] = useState(0);
  const [assistantPanel, setAssistantPanel] = useState<"writing" | "chat" | null>(null);
  const [editorSelection, setEditorSelection] = useState<NoteEditorSelection>({ from: 1, hasSelection: false, text: "", to: 1 });
  const editorRef = useRef<NoteEditorHandle>(null);
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const createNote = useCreateNote();
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: getDefaultValues(note),
    mode: "onChange",
  });
  const [title, contentJson, plainText, categoryId, backgroundColor] = useWatch({
    control: form.control,
    name: ["title", "contentJson", "plainText", "categoryId", "backgroundColor"],
  });
  const autosavePayload = useMemo<NotePayload>(() => ({
    title: title ?? "",
    contentJson: contentJson ?? "",
    plainText: plainText ?? "",
    categoryId: categoryId ?? null,
    backgroundColor: backgroundColor ?? "DEFAULT",
  }), [backgroundColor, categoryId, contentJson, plainText, title]);
  const handleAutosaveSuccess = useCallback((payload: NotePayload) => {
    form.reset(payload);
  }, [form]);
  const handleVersionRestored = useCallback((restoredNote: Note) => {
    form.reset(getDefaultValues(restoredNote));
    setEditorRevision((revision) => revision + 1);
  }, [form]);
  const autosave = useNoteAutosave({
    enabled: Boolean(note) && form.formState.isValid,
    isDirty: form.formState.isDirty,
    noteId: note?.id ?? 0,
    onSaved: handleAutosaveSuccess,
    payload: autosavePayload,
  });
  const isCreating = createNote.isPending;
  const hasUnsavedChanges = Boolean(note) && (form.formState.isDirty || autosave.status === "saving");
  useUnsavedChangesWarning(hasUnsavedChanges);

  async function onSubmit(values: NoteFormValues) {
    setSubmitError(null);

    if (note) {
      await autosave.saveNow();
      return;
    }

    try {
      const savedNote = await createNote.mutateAsync(values);
      form.reset(getDefaultValues(savedNote));
      toast.success("Note created");
      router.replace(`/notes/${savedNote.id}`);
    } catch (error) {
      const apiError = normalizeApiError(error);
      const fieldErrors = apiError.validationErrors;

      if (fieldErrors?.title) form.setError("title", { type: "server", message: fieldErrors.title });
      if (fieldErrors?.plainText) form.setError("plainText", { type: "server", message: fieldErrors.plainText });
      if (fieldErrors?.categoryId) form.setError("categoryId", { type: "server", message: fieldErrors.categoryId });
      if (fieldErrors?.backgroundColor) form.setError("backgroundColor", { type: "server", message: fieldErrors.backgroundColor });
      setSubmitError(apiError.message);
    }
  }

  const saveStatus = isCreating
    ? "Saving…"
    : form.formState.isDirty
      ? "Unsaved changes"
      : note
        ? "Saved"
        : "Not saved yet";
  const wordCount = plainText?.trim() ? plainText.trim().split(/\s+/).length : 0;
  const characterCount = plainText?.length ?? 0;

  return (
    <form className={cn("mx-auto w-full", note && assistantPanel ? "max-w-[100rem]" : "max-w-6xl")} onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="mb-5 flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="ghost" className="w-fit px-2 text-muted-foreground">
          <Link href="/notes"><ArrowLeft aria-hidden="true" />Back to all notes</Link>
        </Button>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {note && <Button type="button" variant={assistantPanel === "writing" ? "secondary" : "outline"} size="sm" onClick={() => setAssistantPanel((current) => current === "writing" ? null : "writing")} aria-expanded={assistantPanel === "writing"}><Sparkles aria-hidden="true" />AI Writing</Button>}
          {note && <Button type="button" variant={assistantPanel === "chat" ? "secondary" : "outline"} size="sm" onClick={() => setAssistantPanel((current) => current === "chat" ? null : "chat")} aria-expanded={assistantPanel === "chat"}><MessageCircle aria-hidden="true" />Chat</Button>}
          {note && <NoteActions note={note} onVersionRestored={handleVersionRestored} versionHistoryDisabled={hasUnsavedChanges} />}
          {note ? (
            <SaveStatus error={autosave.error} hasUnsavedChanges={hasUnsavedChanges} onRetry={() => void autosave.saveNow()} status={autosave.status} />
          ) : (
            <span className="px-2 text-xs text-muted-foreground" aria-live="polite">{saveStatus}</span>
          )}
          <Button type="submit" className="min-w-24" disabled={isCreating || (Boolean(note) && (!form.formState.isDirty || !form.formState.isValid || autosave.status === "saving"))}>
            {isCreating && <LoaderCircle className="animate-spin" aria-hidden="true" />}
            {note ? "Save now" : "Create note"}
          </Button>
        </div>
      </div>

      {submitError && <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">{submitError}</div>}

      <div className={cn(note && assistantPanel && "xl:grid xl:grid-cols-[minmax(0,1fr)_23rem] xl:items-start xl:gap-5")}>
      <div className={cn("min-w-0 overflow-hidden rounded-2xl border shadow-card transition-colors", noteBackgroundClasses[backgroundColor ?? "DEFAULT"])}>
        <div className="border-b bg-background/65 px-5 py-5 backdrop-blur-sm sm:px-8">
          <Label htmlFor="note-title" className="sr-only">Note title</Label>
          <Input
            id="note-title"
            autoFocus={!note}
            maxLength={255}
            placeholder="Untitled note"
            className="h-auto border-0 bg-transparent px-0 py-1 text-2xl font-semibold tracking-tight shadow-none hover:border-0 focus-visible:ring-0 sm:text-3xl"
            aria-invalid={Boolean(form.formState.errors.title)}
            {...form.register("title")}
          />
          {form.formState.errors.title && <p className="mt-2 text-xs text-destructive" role="alert">{form.formState.errors.title.message}</p>}

          <div className="mt-5 grid gap-5 border-t pt-5 sm:grid-cols-[minmax(12rem,1fr)_auto] sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="note-category" className="text-xs text-muted-foreground">Category</Label>
              <select
                id="note-category"
                className="h-10 w-full max-w-xs rounded-lg border bg-surface px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={categoryId ?? ""}
                disabled={categoriesLoading || isCreating}
                onChange={(event) => form.setValue("categoryId", event.target.value ? Number(event.target.value) : null, { shouldDirty: true, shouldValidate: true })}
                aria-invalid={Boolean(form.formState.errors.categoryId)}
              >
                <option value="">Uncategorized</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
              {form.formState.errors.categoryId && <p className="text-xs text-destructive" role="alert">{form.formState.errors.categoryId.message}</p>}
            </div>
            <NoteBackgroundPicker value={backgroundColor ?? "DEFAULT"} disabled={isCreating} onChange={(value) => form.setValue("backgroundColor", value, { shouldDirty: true, shouldValidate: true })} />
          </div>
        </div>

        <NoteEditor
          key={editorRevision}
          ref={editorRef}
          contentJson={contentJson ?? ""}
          fallbackPlainText={plainText ?? ""}
          disabled={isCreating}
          onReadyPlainText={(editorPlainText) => form.setValue("plainText", editorPlainText, { shouldDirty: false })}
          onSelectionChange={setEditorSelection}
          onChange={({ contentJson: nextContentJson, plainText: nextPlainText }) => {
            form.setValue("contentJson", nextContentJson, { shouldDirty: true, shouldValidate: true });
            form.setValue("plainText", nextPlainText, { shouldDirty: true, shouldValidate: true });
          }}
        />
        {(form.formState.errors.contentJson || form.formState.errors.plainText) && (
          <p className="border-t px-5 py-3 text-xs text-destructive sm:px-8" role="alert">
            {form.formState.errors.contentJson?.message ?? form.formState.errors.plainText?.message}
          </p>
        )}

        {note && (
          <footer className="flex flex-col gap-1 border-t bg-background/45 px-5 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <span>Last updated {formatNoteUpdatedAt(note.updatedAt)}</span>
            <span aria-label={`${wordCount} words and ${characterCount} characters`}>
              {wordCount.toLocaleString()} words <span aria-hidden="true">·</span> {characterCount.toLocaleString()} characters
            </span>
          </footer>
        )}
      </div>
      {note && assistantPanel === "writing" && (
        <AiWritingWorkspace
          categories={categories}
          disabled={hasUnsavedChanges}
          documentKey={contentJson ?? ""}
          fullText={plainText ?? ""}
          noteId={note.id}
          onApplyCategory={(nextCategoryId) => form.setValue("categoryId", nextCategoryId, { shouldDirty: true, shouldValidate: true })}
          onApplyTitle={(nextTitle) => form.setValue("title", nextTitle.slice(0, 255), { shouldDirty: true, shouldValidate: true })}
          onInsertBelow={(selection, text) => editorRef.current?.insertBelow(selection, text)}
          onOpenChange={(open) => setAssistantPanel(open ? "writing" : null)}
          onReplace={(selection, text) => editorRef.current?.replaceTarget(selection, text)}
          open
          selection={editorSelection}
        />
      )}
      {note && assistantPanel === "chat" && (
        <NoteChatWorkspace noteId={note.id} noteTitle={note.title} onOpenChange={(open) => setAssistantPanel(open ? "chat" : null)} open />
      )}
      </div>
    </form>
  );
}
