function readPublicUrl(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`${name} is required. Add it to your environment configuration.`);
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} must be a valid absolute URL.`);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${name} must use http:// or https://.`);
  }

  return url.toString().replace(/\/$/, "");
}

export const env = {
  apiBaseUrl: readPublicUrl("NEXT_PUBLIC_API_BASE_URL", process.env.NEXT_PUBLIC_API_BASE_URL),
  siteUrl: readPublicUrl("NEXT_PUBLIC_SITE_URL", process.env.NEXT_PUBLIC_SITE_URL),
} as const;
