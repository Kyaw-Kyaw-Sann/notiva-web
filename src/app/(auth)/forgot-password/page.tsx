import { AuthFormPanel } from "@/features/auth/components/auth-form-panel";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { PasswordRecoveryForm } from "@/features/auth/components/password-recovery-form";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <AuthFormPanel
        eyebrow="Account recovery"
        title="Reset your password"
        description="Enter your account email. We’ll send a verification code so you can securely choose a new password."
      >
        <PasswordRecoveryForm />
      </AuthFormPanel>
    </AuthLayout>
  );
}
