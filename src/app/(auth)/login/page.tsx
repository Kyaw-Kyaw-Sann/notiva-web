import Link from "next/link";

import { AuthFormPanel } from "@/features/auth/components/auth-form-panel";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthFormPanel
        eyebrow="Welcome back"
        title="Sign in to Notiva"
        description="Continue to your notes, ideas, and focused workspace."
        footer={
          <>
            New to Notiva?{" "}
            <Link className="rounded-sm font-medium text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring" href="/register">
              Create an account
            </Link>
          </>
        }
      >
        <LoginForm />
      </AuthFormPanel>
    </AuthLayout>
  );
}
