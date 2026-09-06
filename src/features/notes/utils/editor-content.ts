import type { JSONContent } from "@tiptap/core";

import { createPlainTextContentJson } from "@/features/notes/utils/create-plain-text-content-json";

function isTiptapDocument(value: unknown): value is JSONContent {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;
  return candidate.type === "doc" && (candidate.content === undefined || Array.isArray(candidate.content));
}

export function getEditorContent(contentJson: string | undefined, fallbackPlainText: string) {
  if (contentJson) {
    try {
      const parsed: unknown = JSON.parse(contentJson);
      if (isTiptapDocument(parsed)) {
        return { content: parsed, contentJson };
      }
    } catch {
      // Fall back to the safe plain-text document below.
    }
  }

  const fallbackContentJson = createPlainTextContentJson(fallbackPlainText);
  return {
    content: JSON.parse(fallbackContentJson) as JSONContent,
    contentJson: fallbackContentJson,
  };
}
