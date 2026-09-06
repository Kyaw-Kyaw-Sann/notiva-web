export type UserRole = "USER" | "ADMIN";
export type UserPlan = "NORMAL" | "PREMIUM";

export type AuthUser = {
  id: number;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  plan: UserPlan;
  emailVerified: boolean;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterInput = {
  displayName: string;
  email: string;
  password: string;
};

export type ForgotPasswordInput = {
  email: string;
};

export type VerifyResetOtpInput = {
  email: string;
  otp: string;
};

export type ResetPasswordInput = VerifyResetOtpInput & {
  newPassword: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: AuthUser;
};

export type RefreshTokenInput = {
  refreshToken: string;
};

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
};

export type RegisterResponse = {
  id: number;
  email: string;
  displayName: string;
  emailVerified: boolean;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: number | null;
  user: AuthUser;
};
