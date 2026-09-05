import type { AuthSession, AuthUser } from "@/features/auth/types/auth.types";

const AUTH_SESSION_KEY = "notiva.auth.session";

function isAuthUser(value: unknown): value is AuthUser {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "number" &&
    typeof candidate.email === "string" &&
    typeof candidate.displayName === "string" &&
    (typeof candidate.avatarUrl === "string" || candidate.avatarUrl === null) &&
    (candidate.role === "USER" || candidate.role === "ADMIN") &&
    (candidate.plan === "NORMAL" || candidate.plan === "PREMIUM") &&
    typeof candidate.emailVerified === "boolean"
  );
}

function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.accessToken === "string" &&
    (typeof candidate.refreshToken === "string" || candidate.refreshToken === null) &&
    (typeof candidate.expiresAt === "number" || candidate.expiresAt === null) &&
    isAuthUser(candidate.user)
  );
}

export function readAuthSession(): AuthSession | null {
  try {
    const storedSession = window.sessionStorage.getItem(AUTH_SESSION_KEY);
    if (!storedSession) return null;

    const parsedSession: unknown = JSON.parse(storedSession);
    return isAuthSession(parsedSession) ? parsedSession : null;
  } catch {
    return null;
  }
}

export function writeAuthSession(session: AuthSession) {
  window.sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function removeAuthSession() {
  window.sessionStorage.removeItem(AUTH_SESSION_KEY);
}
