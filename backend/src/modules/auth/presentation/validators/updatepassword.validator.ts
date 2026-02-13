import { z } from "zod";

export const UpdatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, "Current password is required"),

  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[0-9]/, "Must include a number"),
});
