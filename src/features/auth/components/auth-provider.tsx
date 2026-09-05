"use client";

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { getCurrentUser, login } from "@/features/auth/api/auth-api";
import type { AuthSession, AuthUser, LoginCredentials } from "@/features/auth/types/auth.types";
import { readAuthSession, removeAuthSession, writeAuthSession } from "@/features/auth/utils/auth-storage";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  session: AuthSession | null;
  user: AuthUser | null;
  status: AuthStatus;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  completeOAuth: (accessToken: string) => Promise<void>;
  clearSession: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const establishSession = useCallback((nextSession: AuthSession) => {
    writeAuthSession(nextSession);
    setSession(nextSession);
    setStatus("authenticated");
  }, []);

  const clearSession = useCallback(() => {
    removeAuthSession();
    setSession(null);
    setStatus("unauthenticated");
  }, []);

  useEffect(() => {
    let isActive = true;

    async function initializeSession() {
      await Promise.resolve();
      const storedSession = readAuthSession();

      if (!storedSession || (storedSession.expiresAt !== null && storedSession.expiresAt <= Date.now())) {
        if (isActive) clearSession();
        return;
      }

      try {
        const user = await getCurrentUser(storedSession.accessToken);
        if (isActive) establishSession({ ...storedSession, user });
      } catch {
        if (isActive) clearSession();
      }
    }

    void initializeSession();

    return () => {
      isActive = false;
    };
  }, [clearSession, establishSession]);

  const signIn = useCallback(
    async (credentials: LoginCredentials) => {
      const response = await login(credentials);
      establishSession({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt: Date.now() + response.expiresIn,
        user: response.user,
      });
    },
    [establishSession],
  );

  const completeOAuth = useCallback(
    async (accessToken: string) => {
      const user = await getCurrentUser(accessToken);
      establishSession({ accessToken, refreshToken: null, expiresAt: null, user });
    },
    [establishSession],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ session, user: session?.user ?? null, status, signIn, completeOAuth, clearSession }),
    [clearSession, completeOAuth, session, signIn, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
