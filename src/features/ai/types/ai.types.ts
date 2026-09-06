export type AiSummaryLength = "SHORT" | "MEDIUM" | "DETAILED";

export type AiWritingAction =
  | "IMPROVE"
  | "FIX_GRAMMAR"
  | "SHORTEN"
  | "EXPAND"
  | "PROFESSIONAL"
  | "CONTINUE"
  | "CUSTOM";

export type AiUsage = {
  plan: "NORMAL" | "PREMIUM";
  dailyLimit: number;
  used: number;
  remaining: number;
  usageDate: string;
};

export type AiWritingRequest = {
  action: AiWritingAction;
  selectedText: string;
  instruction: string | null;
};

type AiGenerationMetadata = {
  model?: string;
  usage?: AiUsage;
};

export type AiWritingResponse = AiGenerationMetadata & {
  content: string;
};

export type AiTitleResponse = AiGenerationMetadata & {
  title: string;
};

export type AiSummaryResponse = AiGenerationMetadata & {
  summary: string;
};

export type AiCategorySuggestionResponse = AiGenerationMetadata & {
  category: {
    id: number;
    name: string;
  } | null;
};

export type AiWritingCommand =
  | { type: "GENERATE_TITLE" }
  | { type: "SUMMARIZE"; length: AiSummaryLength }
  | { type: "WRITE"; payload: AiWritingRequest }
  | { type: "SUGGEST_CATEGORY" };

export type AiWritingResult =
  | { kind: "text"; label: string; text: string }
  | { kind: "title"; label: string; text: string }
  | { kind: "category"; categoryId: number | null; categoryName: string | null; label: string; text: string };

export type AiConversationType = "NOTE_CHAT" | "ALL_NOTES_CHAT";
export type AiMessageRole = "USER" | "ASSISTANT";

export type AiConversation = {
  id: number;
  title: string;
  type: AiConversationType;
  note: { id: number; title: string } | null;
  createdAt: string;
  updatedAt: string;
};

export type AiMessage = {
  id: number;
  role: AiMessageRole;
  content: string;
  createdAt: string;
};

export type AiChatResponse = {
  userMessage: AiMessage;
  assistantMessage: AiMessage;
  model: string;
  usage: AiUsage;
};

export type CreateConversationPayload = { title?: string };
export type UpdateConversationPayload = { title: string };
export type SendMessagePayload = { message: string };

export type SemanticSearchResponse = {
  question: string;
  resultCount: number;
  results: SemanticSearchResult[];
};

export type SemanticSearchResult = {
  chunkId: number;
  noteId: number;
  noteTitle: string;
  chunkIndex: number;
  content: string;
  similarity: number;
};
