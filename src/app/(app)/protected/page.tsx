"use client";

import { ShieldCheck } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/use-auth";

export default function ProtectedPage() {
  const { user } = useAuth();

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <ShieldCheck className="size-8 text-success" />
          <CardTitle className="mt-2">Core authentication is ready</CardTitle>
          <CardDescription>This temporary page verifies the protected-route boundary.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm"><span className="text-muted-foreground">Signed in as </span><span className="font-medium">{user?.displayName}</span></CardContent>
      </Card>
    </main>
  );
}
