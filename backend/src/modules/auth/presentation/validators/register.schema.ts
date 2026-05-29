import { z } from "zod";

const VALID_ROLES = ["candidate", "recruiter"] as const;

export const RegisterSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .max(255, "Email is too long"),

  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must contain exactly 6 digits"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password cannot exceed 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),

  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s.'-]+$/, "Full name contains invalid characters"),

  role: z.enum(VALID_ROLES),
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;
