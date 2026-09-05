import { get, post, requestEnvelope } from "@/lib/api";
import { env } from "@/lib/constants/env";
import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
  RegisterInput,
  RegisterResponse,
} from "@/features/auth/types/auth.types";

export function login(credentials: LoginCredentials) {
  return post<LoginResponse, LoginCredentials>("/api/auth/login", credentials);
}

export function register(input: RegisterInput) {
  return requestEnvelope<RegisterResponse>("post", "/api/auth/register", { data: input });
}

export function getCurrentUser(accessToken: string) {
  return get<AuthUser>("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getGoogleOAuthUrl() {
  return `${env.apiBaseUrl}/oauth2/authorization/google`;
}
