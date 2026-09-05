import { Feather } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="mx-auto mb-7 flex w-fit items-center gap-2 rounded-md text-xl font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-ring">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Feather className="size-5" /></span>
          Notiva
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
        <div className="mt-5 text-center text-sm text-muted-foreground">{footer}</div>
      </div>
    </main>
  );
}
