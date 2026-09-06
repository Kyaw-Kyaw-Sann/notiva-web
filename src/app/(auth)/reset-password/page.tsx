import Link from "next/link";

import { AuthFormPanel } from "@/features/auth/components/auth-form-panel";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <AuthFormPanel
        eyebrow="Secure password reset"
        title="Choose a new password"
        description="Use a strong, unique password for your Notiva account."
        footer={
          <Link className="rounded-sm font-medium text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring" href="/login">
            Return to sign in
          </Link>
        }
      >
        <ResetPasswordForm />
      </AuthFormPanel>
    </AuthLayout>
  );
}
