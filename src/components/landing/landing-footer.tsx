import Link from "next/link";

import { NotivaBrand } from "@/components/landing/notiva-brand";

export function LandingFooter() {
  return (
    <footer className="border-t bg-surface-muted/40">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div><NotivaBrand /><p className="mt-2 text-sm text-muted-foreground">A focused workspace for notes and ideas.</p></div>
        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm" aria-label="Footer navigation">
          <Link href="#features" className="rounded-sm text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">Features</Link>
          <Link href="#product" className="rounded-sm text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">Product</Link>
          <Link href="/login" className="rounded-sm text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">Sign In</Link>
          <Link href="/register" className="rounded-sm text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">Sign Up</Link>
        </nav>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Notiva</p>
      </div>
    </footer>
  );
}
