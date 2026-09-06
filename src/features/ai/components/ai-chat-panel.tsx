"use client";

import { AlertCircle, LoaderCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ConversationHeader } from "@/features/ai/components/conversation-header";
import { MessageInput } from "@/features/ai/components/message-input";
import { MessageList } from "@/features/ai/components/message-list";
import { useAiConversation, useAiMessages, useSendAiMessage } from "@/features/ai/hooks/use-ai-conversations";
import type { AiConversation } from "@/features/ai/types/ai.types";
import { normalizeApiError } from "@/lib/api";

export function AiChatPanel({ conversation, onDeleted }: { conversation: AiConversation; onDeleted: () => void }) {
  const [sendError, setSendError] = useState<string | null>(null);
  const conversationDetail = useAiConversation(conversation.id);
  const messages = useAiMessages(conversation.id);
  const sendMessage = useSendAiMessage(conversation.id);
  const activeConversation = conversationDetail.data ?? conversation;

  async function send(message: string) {
    setSendError(null);
    try {
      await sendMessage.mutateAsync({ message });
      return true;
    } catch (error) {
      setSendError(normalizeApiError(error).message);
      return false;
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <ConversationHeader key={activeConversation.id} conversation={activeConversation} onDeleted={onDeleted} />
      {conversationDetail.isError && <div className="mx-4 mt-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs" role="alert"><p>{normalizeApiError(conversationDetail.error).message}</p><Button type="button" variant="ghost" size="sm" className="mt-1 h-7 px-2" onClick={() => void conversationDetail.refetch()}>Retry conversation</Button></div>}
      <div className="notiva-scrollbar min-h-0 flex-1 overflow-y-auto">
        {messages.isLoading && <div className="flex min-h-64 items-center justify-center"><LoaderCircle className="size-6 animate-spin text-primary" aria-label="Loading messages" /></div>}
        {messages.isError && <div className="m-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm" role="alert"><p>{normalizeApiError(messages.error).message}</p><Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => void messages.refetch()}>Try again</Button></div>}
        {messages.data && <MessageList messages={messages.data} />}
        {sendMessage.isPending && <div className="mx-4 mb-4 flex items-center gap-2 text-xs text-muted-foreground"><LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />Notiva is thinking…</div>}
      </div>
      {sendError && <div className="mx-3 mb-2 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive" role="alert"><AlertCircle className="mt-0.5 size-3.5 shrink-0" />{sendError}</div>}
      {sendMessage.data?.usage && <p className="px-4 pb-2 text-[11px] text-muted-foreground">{sendMessage.data.usage.remaining} AI credits remaining today</p>}
      <MessageInput disabled={sendMessage.isPending || messages.isLoading} onSend={send} />
    </div>
  );
}
