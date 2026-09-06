import { AppApiError, normalizeApiError } from "@/lib/api";

export function normalizeAiError(error: unknown) {
  const apiError = normalizeApiError(error);

  if (apiError.status === 429) {
    return new AppApiError("Your AI usage limit has been reached. Please try again later.", { status: 429 });
  }

  if (apiError.status === 502 || apiError.status === 503 || apiError.status === 504) {
    return new AppApiError("AI is temporarily unavailable. Please try again.", { status: apiError.status });
  }

  return apiError;
}
