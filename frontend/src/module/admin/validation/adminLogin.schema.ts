import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters"),

  rememberMe: z.boolean().optional().default(false),
});

export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export type AdminLoginFieldErrors = Partial<
  Record<keyof AdminLoginFormData, string>
>;