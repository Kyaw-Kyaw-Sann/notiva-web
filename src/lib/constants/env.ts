const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl && process.env.NODE_ENV === "development") {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is required. Add it to your .env.local file.",
  );
}

export const env = {
  apiBaseUrl: apiBaseUrl ?? "",
} as const;
