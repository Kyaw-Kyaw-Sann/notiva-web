import type { VerifyResetOtpInput } from "@/features/auth/types/auth.types";

const PASSWORD_RECOVERY_KEY = "notiva.password-recovery";

function isPendingPasswordRecovery(value: unknown): value is VerifyResetOtpInput {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return typeof candidate.email === "string" && typeof candidate.otp === "string";
}

export function readPendingPasswordRecovery(): VerifyResetOtpInput | null {
  try {
    const storedValue = window.sessionStorage.getItem(PASSWORD_RECOVERY_KEY);
    if (!storedValue) return null;

    const parsedValue: unknown = JSON.parse(storedValue);
    return isPendingPasswordRecovery(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

export function writePendingPasswordRecovery(value: VerifyResetOtpInput) {
  window.sessionStorage.setItem(PASSWORD_RECOVERY_KEY, JSON.stringify(value));
}

export function removePendingPasswordRecovery() {
  window.sessionStorage.removeItem(PASSWORD_RECOVERY_KEY);
}
