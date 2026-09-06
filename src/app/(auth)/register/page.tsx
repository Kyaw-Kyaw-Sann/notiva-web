import Link from "next/link";

import { AuthFormPanel } from "@/features/auth/components/auth-form-panel";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <AuthFormPanel
        eyebrow="Start writing with clarity"
        title="Create your account"
        description="Set up your personal workspace and keep every important idea within reach."
        footer={
          <>
            Already have an account?{" "}
            <Link className="rounded-sm font-medium text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring" href="/login">
              Sign in
            </Link>
          </>
        }
      >
        <RegisterForm />
      </AuthFormPanel>
    </AuthLayout>
  );
}
