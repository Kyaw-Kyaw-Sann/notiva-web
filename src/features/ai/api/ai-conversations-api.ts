import type { AiChatResponse, AiConversation, AiMessage, CreateConversationPayload, SemanticSearchResponse, SendMessagePayload, UpdateConversationPayload } from "@/features/ai/types/ai.types";
import { get, patch, post, remove } from "@/lib/api";

export function createNoteConversation(noteId: number, payload?: CreateConversationPayload) {
  return post<AiConversation, CreateConversationPayload | undefined>(`/api/notes/${noteId}/ai/conversations`, payload);
}

export function createAllNotesConversation(payload?: CreateConversationPayload) {
  return post<AiConversation, CreateConversationPayload | undefined>("/api/ai/conversations/all-notes", payload);
}

export function getConversations() {
  return get<AiConversation[]>("/api/ai/conversations");
}

export function getConversation(conversationId: number) {
  return get<AiConversation>(`/api/ai/conversations/${conversationId}`);
}

export function updateConversation(conversationId: number, payload: UpdateConversationPayload) {
  return patch<AiConversation, UpdateConversationPayload>(`/api/ai/conversations/${conversationId}`, payload);
}

export function deleteConversation(conversationId: number) {
  return remove<null>(`/api/ai/conversations/${conversationId}`);
}

export function getConversationMessages(conversationId: number) {
  return get<AiMessage[]>(`/api/ai/conversations/${conversationId}/messages`);
}

export function sendConversationMessage(conversationId: number, payload: SendMessagePayload) {
  return post<AiChatResponse, SendMessagePayload>(`/api/ai/conversations/${conversationId}/messages`, payload);
}

export function searchNotesSemantically(question: string) {
  return post<SemanticSearchResponse, { question: string }>("/api/ai/embeddings/semantic-search", { question });
}
