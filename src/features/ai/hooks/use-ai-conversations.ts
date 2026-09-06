"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createAllNotesConversation, createNoteConversation, deleteConversation, getConversation, getConversationMessages, getConversations, searchNotesSemantically, sendConversationMessage, updateConversation } from "@/features/ai/api/ai-conversations-api";
import { normalizeAiError } from "@/features/ai/api/ai-error";
import type { AiConversation, AiMessage, CreateConversationPayload, SendMessagePayload, UpdateConversationPayload } from "@/features/ai/types/ai.types";

export const aiQueryKeys = {
  conversations: ["ai", "conversations"] as const,
  conversation: (conversationId: number) => ["ai", "conversation", conversationId] as const,
  messages: (conversationId: number) => ["ai", "conversation", conversationId, "messages"] as const,
};

export function useAiConversations() {
  return useQuery({ queryKey: aiQueryKeys.conversations, queryFn: getConversations });
}

export function useAiConversation(conversationId: number | null) {
  return useQuery({
    queryKey: aiQueryKeys.conversation(conversationId ?? 0),
    queryFn: () => getConversation(conversationId ?? 0),
    enabled: conversationId !== null,
  });
}

export function useAiMessages(conversationId: number | null) {
  return useQuery({
    queryKey: aiQueryKeys.messages(conversationId ?? 0),
    queryFn: () => getConversationMessages(conversationId ?? 0),
    enabled: conversationId !== null,
  });
}

export function useCreateNoteConversation(noteId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload?: CreateConversationPayload) => createNoteConversation(noteId, payload),
    onSuccess: (conversation) => {
      queryClient.setQueryData(aiQueryKeys.conversation(conversation.id), conversation);
      void queryClient.invalidateQueries({ queryKey: aiQueryKeys.conversations });
    },
  });
}

export function useCreateAllNotesConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload?: CreateConversationPayload) => createAllNotesConversation(payload),
    onSuccess: (conversation) => {
      queryClient.setQueryData(aiQueryKeys.conversation(conversation.id), conversation);
      void queryClient.invalidateQueries({ queryKey: aiQueryKeys.conversations });
    },
  });
}

export function useUpdateAiConversation(conversationId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateConversationPayload) => updateConversation(conversationId, payload),
    onSuccess: (conversation) => {
      queryClient.setQueryData(aiQueryKeys.conversation(conversationId), conversation);
      queryClient.setQueryData<AiConversation[]>(aiQueryKeys.conversations, (current) => current?.map((item) => item.id === conversationId ? conversation : item));
    },
  });
}

export function useDeleteAiConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteConversation,
    onSuccess: (_, conversationId) => {
      queryClient.removeQueries({ queryKey: aiQueryKeys.conversation(conversationId) });
      queryClient.setQueryData<AiConversation[]>(aiQueryKeys.conversations, (current) => current?.filter((item) => item.id !== conversationId));
    },
  });
}

export function useSendAiMessage(conversationId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SendMessagePayload) => {
      try {
        return await sendConversationMessage(conversationId, payload);
      } catch (error) {
        throw normalizeAiError(error);
      }
    },
    onSuccess: (response) => {
      queryClient.setQueryData<AiMessage[]>(aiQueryKeys.messages(conversationId), (current = []) => {
        const incoming = [response.userMessage, response.assistantMessage];
        const existingIds = new Set(current.map((message) => message.id));
        return [...current, ...incoming.filter((message) => !existingIds.has(message.id))];
      });
      void queryClient.invalidateQueries({ queryKey: aiQueryKeys.conversations });
    },
  });
}

export function useSemanticSearch() {
  return useMutation({
    mutationFn: async (question: string) => {
      try {
        return await searchNotesSemantically(question);
      } catch (error) {
        throw normalizeAiError(error);
      }
    },
  });
}
