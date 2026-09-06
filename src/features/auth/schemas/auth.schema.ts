import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
});

export const verifyResetOtpSchema = z.object({
  otp: z.string().trim().min(1, "Verification code is required."),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(1, "New password is required."),
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const registerSchema = z
  .object({
    displayName: z.string().trim().min(1, "Display name is required."),
    email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
    password: z.string().min(1, "Password is required."),
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type VerifyResetOtpFormValues = z.infer<typeof verifyResetOtpSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
