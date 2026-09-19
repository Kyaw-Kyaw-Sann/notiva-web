import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppProviders } from "@/providers/app-providers";
import { env } from "@/lib/constants/env";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  applicationName: "Notiva",
  title: {
    default: "Notiva — Notes, writing, and ideas in one workspace",
    template: "%s | Notiva",
  },
  description: "A focused note-taking workspace with rich-text editing, reliable organization, version history, and user-controlled AI assistance.",
  keywords: ["Notiva", "note taking", "rich text editor", "AI writing assistant", "productivity"],
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Notiva",
    title: "Notiva — Notes, writing, and ideas in one workspace",
    description: "Capture, organize, and develop ideas in a focused notes workspace.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Notiva — Notes, writing, and ideas in one workspace",
    description: "Capture, organize, and develop ideas in a focused notes workspace.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
