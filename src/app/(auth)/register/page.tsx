import Link from "next/link";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return <AuthShell title="Create your account" description="Start a focused workspace for your notes." footer={<>Already have an account? <Link className="font-medium text-primary hover:underline" href="/login">Sign in</Link></>}><RegisterForm /></AuthShell>;
}
