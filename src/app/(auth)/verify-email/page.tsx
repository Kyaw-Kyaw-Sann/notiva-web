import { AuthFormPanel } from "@/features/auth/components/auth-form-panel";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { EmailVerificationResult } from "@/features/auth/components/email-verification-result";

export default function VerifyEmailPage() {
  return (
    <AuthLayout>
      <AuthFormPanel
        eyebrow="Email verification"
        title="Confirming your account"
        description="We’re checking your verification link so you can securely access Notiva."
      >
        <EmailVerificationResult />
      </AuthFormPanel>
    </AuthLayout>
  );
}
