import { get, post, requestEnvelope } from "@/lib/api";
import { env } from "@/lib/constants/env";
import type {
  AuthUser,
  ForgotPasswordInput,
  LoginCredentials,
  LoginResponse,
  RefreshResponse,
  RefreshTokenInput,
  ResetPasswordInput,
  RegisterInput,
  RegisterResponse,
  VerifyResetOtpInput,
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

export function forgotPassword(input: ForgotPasswordInput) {
  return requestEnvelope<null>("post", "/api/auth/forgot-password", { data: input, skipAuth: true });
}

export function verifyResetOtp(input: VerifyResetOtpInput) {
  return requestEnvelope<null>("post", "/api/auth/verify-reset-otp", { data: input, skipAuth: true });
}

export function resetPassword(input: ResetPasswordInput) {
  return requestEnvelope<null>("post", "/api/auth/reset-password", { data: input, skipAuth: true });
}

export function verifyEmail(token: string) {
  return requestEnvelope<null>("get", "/api/auth/verify-email", {
    params: { token },
    skipAuth: true,
  });
}

export function getGoogleOAuthUrl() {
  return `${env.apiBaseUrl}/oauth2/authorization/google`;
}
