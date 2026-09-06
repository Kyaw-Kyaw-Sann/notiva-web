import { get, post } from "@/lib/api";
import type { AiCategorySuggestionResponse, AiSummaryLength, AiSummaryResponse, AiTitleResponse, AiUsage, AiWritingRequest, AiWritingResponse } from "@/features/ai/types/ai.types";

export function getAiUsage() {
  return get<AiUsage>("/api/ai/usage");
}

export function generateNoteTitle(noteId: number) {
  return post<AiTitleResponse>(`/api/notes/${noteId}/ai/generate-title`);
}

export function summarizeNote(noteId: number, length: AiSummaryLength) {
  return post<AiSummaryResponse, { length: AiSummaryLength }>(`/api/notes/${noteId}/ai/summarize`, { length });
}

export function generateNoteWriting(noteId: number, payload: AiWritingRequest) {
  return post<AiWritingResponse, AiWritingRequest>(`/api/notes/${noteId}/ai/write`, payload);
}

export function suggestNoteCategory(noteId: number) {
  return post<AiCategorySuggestionResponse>(`/api/notes/${noteId}/ai/suggest-category`);
}
