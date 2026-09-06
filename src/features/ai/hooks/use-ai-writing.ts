"use client";

import { useMutation } from "@tanstack/react-query";

import { generateNoteTitle, generateNoteWriting, suggestNoteCategory, summarizeNote } from "@/features/ai/api/ai-writing-api";
import { normalizeAiError } from "@/features/ai/api/ai-error";
import type { AiWritingCommand, AiWritingResult } from "@/features/ai/types/ai.types";

async function runAiCommand(noteId: number, command: AiWritingCommand): Promise<AiWritingResult> {
  try {
    switch (command.type) {
      case "GENERATE_TITLE": {
        const response = await generateNoteTitle(noteId);
        return { kind: "title", label: "Generated title", text: response.title };
      }
      case "SUMMARIZE": {
        const response = await summarizeNote(noteId, command.length);
        return { kind: "text", label: `${command.length.toLowerCase()} summary`, text: response.summary };
      }
      case "SUGGEST_CATEGORY": {
        const response = await suggestNoteCategory(noteId);
        return {
          kind: "category",
          categoryId: response.category?.id ?? null,
          categoryName: response.category?.name ?? null,
          label: "Suggested category",
          text: response.category?.name ?? "No suitable category was found.",
        };
      }
      case "WRITE": {
        const response = await generateNoteWriting(noteId, command.payload);
        return { kind: "text", label: command.payload.action.toLowerCase().replaceAll("_", " "), text: response.content };
      }
    }
  } catch (error) {
    throw normalizeAiError(error);
  }
}

export function useAiWriting(noteId: number) {
  return useMutation({
    mutationFn: (command: AiWritingCommand) => runAiCommand(noteId, command),
  });
}
