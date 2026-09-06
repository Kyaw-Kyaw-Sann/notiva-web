"use client";

import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { AppApiError } from "@/lib/api";
import { configureAuthInterceptors } from "@/lib/api/auth-interceptors";
import { getCurrentUser, login, logout, refreshSession } from "@/features/auth/api/auth-api";
import type { AuthSession, AuthUser, LoginCredentials } from "@/features/auth/types/auth.types";
import { readAuthSession, removeAuthSession, writeAuthSession } from "@/features/auth/utils/auth-storage";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  session: AuthSession | null;
  user: AuthUser | null;
  status: AuthStatus;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  completeOAuth: (accessToken: string) => Promise<void>;
  clearSession: () => void;
  updateUser: (user: AuthUser) => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const sessionRef = useRef<AuthSession | null>(null);
  const refreshPromiseRef = useRef<Promise<AuthSession> | null>(null);
  const sessionVersionRef = useRef(0);
  const redirectingRef = useRef(false);

  const establishSession = useCallback((nextSession: AuthSession) => {
    sessionVersionRef.current += 1;
    sessionRef.current = nextSession;
    writeAuthSession(nextSession);
    setSession(nextSession);
    setStatus("authenticated");
  }, []);

  const clearSession = useCallback(() => {
    sessionVersionRef.current += 1;
    sessionRef.current = null;
    removeAuthSession();
    setSession(null);
    setStatus("unauthenticated");
  }, []);

  const updateUser = useCallback((user: AuthUser) => {
    const currentSession = sessionRef.current ?? readAuthSession();

    if (!currentSession) return;

    establishSession({ ...currentSession, user });
  }, [establishSession]);

  const redirectToLogin = useCallback(() => {
    clearSession();

    if (redirectingRef.current || window.location.pathname === "/login") {
      return;
    }

    redirectingRef.current = true;
    window.location.replace("/login");
  }, [clearSession]);

  const refreshCurrentSession = useCallback(
    async (sessionOverride?: AuthSession): Promise<AuthSession> => {
      if (refreshPromiseRef.current) {
        return refreshPromiseRef.current;
      }

      const currentSession = sessionOverride ?? sessionRef.current ?? readAuthSession();

      if (!currentSession?.refreshToken) {
        clearSession();
        throw new AppApiError("Your session has expired. Please sign in again.", { status: 401 });
      }

      const refreshVersion = sessionVersionRef.current;
      const refreshPromise = refreshSession(currentSession.refreshToken)
        .then((response) => {
          if (sessionVersionRef.current !== refreshVersion) {
            throw new AppApiError("Your session is no longer active. Please sign in again.", { status: 401 });
          }

          const nextSession: AuthSession = {
            ...currentSession,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expiresAt: Date.now() + response.expiresIn,
          };

          establishSession(nextSession);
          return nextSession;
        })
        .catch((error: unknown) => {
          clearSession();
          throw error;
        })
        .finally(() => {
          refreshPromiseRef.current = null;
        });

      refreshPromiseRef.current = refreshPromise;
      return refreshPromise;
    },
    [clearSession, establishSession],
  );

  useEffect(() => {
    return configureAuthInterceptors({
      getAccessToken: () => sessionRef.current?.accessToken ?? readAuthSession()?.accessToken ?? null,
      refreshAccessToken: async () => (await refreshCurrentSession()).accessToken,
      onSessionExpired: redirectToLogin,
    });
  }, [redirectToLogin, refreshCurrentSession]);

  useEffect(() => {
    let isActive = true;

    async function initializeSession() {
      await Promise.resolve();
      const storedSession = readAuthSession();

      if (!storedSession) {
        if (isActive) clearSession();
        return;
      }

      try {
        const activeSession = storedSession.expiresAt !== null && storedSession.expiresAt <= Date.now()
          ? await refreshCurrentSession(storedSession)
          : storedSession;
        const user = await getCurrentUser(activeSession.accessToken);

        if (isActive) establishSession({ ...activeSession, user });
      } catch {
        if (isActive) clearSession();
      }
    }

    void initializeSession();

    return () => {
      isActive = false;
    };
  }, [clearSession, establishSession, refreshCurrentSession]);

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

  const signOut = useCallback(async () => {
    const currentSession = sessionRef.current ?? readAuthSession();

    try {
      if (currentSession?.refreshToken) {
        await logout(currentSession.refreshToken);
      }
    } catch {
      // Local cleanup is required even when the backend token is already invalid.
    } finally {
      redirectToLogin();
    }
  }, [redirectToLogin]);

  const completeOAuth = useCallback(
    async (accessToken: string) => {
      const user = await getCurrentUser(accessToken);
      establishSession({ accessToken, refreshToken: null, expiresAt: null, user });
    },
    [establishSession],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ session, user: session?.user ?? null, status, signIn, signOut, completeOAuth, clearSession, updateUser }),
    [clearSession, completeOAuth, session, signIn, signOut, status, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
