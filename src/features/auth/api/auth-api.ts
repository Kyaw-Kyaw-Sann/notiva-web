import { get, post, requestEnvelope } from "@/lib/api";
import { env } from "@/lib/constants/env";
import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
  RefreshResponse,
  RefreshTokenInput,
  RegisterInput,
  RegisterResponse,
} from "@/features/auth/types/auth.types";

export function login(credentials: LoginCredentials) {
  return post<LoginResponse, LoginCredentials>("/api/auth/login", credentials, { skipAuth: true });
}

export function register(input: RegisterInput) {
  return requestEnvelope<RegisterResponse>("post", "/api/auth/register", { data: input, skipAuth: true });
}

export function getCurrentUser(accessToken: string) {
  return get<AuthUser>("/api/auth/me", {
    skipAuth: true,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function refreshSession(refreshToken: string) {
  return post<RefreshResponse, RefreshTokenInput>("/api/auth/refresh", { refreshToken }, { skipAuth: true });
}

export function logout(refreshToken: string) {
  return post<null, RefreshTokenInput>("/api/auth/logout", { refreshToken }, { skipAuth: true });
}

export function getGoogleOAuthUrl() {
  return `${env.apiBaseUrl}/oauth2/authorization/google`;
}
