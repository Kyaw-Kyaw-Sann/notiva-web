import Link from "next/link";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return <AuthShell title="Welcome back" description="Sign in to continue to your notes." footer={<>New to Notiva? <Link className="font-medium text-primary hover:underline" href="/register">Create an account</Link></>}><LoginForm /></AuthShell>;
}
