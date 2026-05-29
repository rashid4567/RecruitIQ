import { z } from "zod";

export const UpdatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Current password must be at least 8 characters")
      .max(128, "Current password cannot exceed 128 characters"),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(128, "New password cannot exceed 128 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[a-z]/, "Must include at least one lowercase letter")
      .regex(/\d/, "Must include at least one number")
      .regex(/[@$!%*?&]/, "Must include at least one special character"),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    path: ["newPassword"],
    message: "New password must be different from current password",
  });

export type UpdatePasswordDTO = z.infer<typeof UpdatePasswordSchema>;
