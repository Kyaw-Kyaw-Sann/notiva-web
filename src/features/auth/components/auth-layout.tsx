import type { ReactNode } from "react";

import { NotivaBrand } from "@/components/landing/notiva-brand";
import { AuthBrandPanel } from "@/features/auth/components/auth-brand-panel";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-svh bg-background lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(28rem,0.95fr)]">
      <section className="flex min-h-svh flex-col px-5 py-6 sm:px-10 sm:py-8 lg:px-12 xl:px-16">
        <header>
          <NotivaBrand />
        </header>

        <div className="flex flex-1 items-center justify-center py-10 sm:py-14">{children}</div>

        <p className="text-center text-xs text-muted-foreground sm:text-left">
          A calm workspace for your notes and ideas.
        </p>
      </section>

      <AuthBrandPanel />
    </main>
  );
}
