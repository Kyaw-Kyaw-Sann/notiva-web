import { isAxiosError } from "axios";
import type { AxiosError } from "axios";

import type { ApiErrorResponse, ApiValidationErrors } from "@/lib/api/api-types";

type AppApiErrorOptions = {
  status?: number;
  validationErrors?: ApiValidationErrors;
  isNetworkError?: boolean;
};

export class AppApiError extends Error {
  readonly status?: number;
  readonly validationErrors?: ApiValidationErrors;
  readonly isNetworkError: boolean;

  constructor(message: string, options: AppApiErrorOptions = {}) {
    super(message);
    this.name = "AppApiError";
    this.status = options.status;
    this.validationErrors = options.validationErrors;
    this.isNetworkError = options.isNetworkError ?? false;
  }
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    candidate.success === false &&
    typeof candidate.status === "number" &&
    typeof candidate.error === "string" &&
    typeof candidate.message === "string" &&
    typeof candidate.path === "string" &&
    typeof candidate.timestamp === "string"
  );
}

function fallbackMessage(status?: number) {
  switch (status) {
    case 401:
      return "Your session is unavailable. Please sign in again.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "This resource is unavailable.";
    case 409:
      return "This action conflicts with the current data. Please try again.";
    case 429:
      return "Too many requests. Please try again shortly.";
    case 502:
    case 503:
    case 504:
      return "This service is temporarily unavailable. Please try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export function normalizeApiError(error: unknown): AppApiError {
  if (error instanceof AppApiError) {
    return error;
  }

  if (!isAxiosError(error)) {
    return new AppApiError(fallbackMessage());
  }

  return normalizeAxiosError(error);
}

function normalizeAxiosError(error: AxiosError<unknown>): AppApiError {
  const status = error.response?.status;
  const responseData = error.response?.data;

  if (isApiErrorResponse(responseData)) {
    return new AppApiError(responseData.message, {
      status: responseData.status,
      validationErrors: responseData.validationErrors,
    });
  }

  return new AppApiError(fallbackMessage(status), {
    status,
    isNetworkError: !error.response,
  });
}
