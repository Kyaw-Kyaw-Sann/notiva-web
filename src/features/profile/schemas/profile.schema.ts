import { z } from "zod";

export const profileSchema = z.object({
  displayName: z.string().trim().min(1, "Display name is required.").max(100, "Display name must be 100 characters or fewer."),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(8, "New password must be at least 8 characters.").max(100, "New password must be 100 characters or fewer."),
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
