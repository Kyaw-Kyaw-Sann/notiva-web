import type { MetadataRoute } from "next";

import { env } from "@/lib/constants/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/ai",
        "/favorites",
        "/forgot-password",
        "/login",
        "/notes",
        "/oauth2",
        "/pinned",
        "/protected",
        "/register",
        "/reset-password",
        "/trash",
        "/verify-email",
      ],
    },
    sitemap: `${env.siteUrl}/sitemap.xml`,
  };
}
