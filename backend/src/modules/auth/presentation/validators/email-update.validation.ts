import { z } from "zod";
import { OTP_ROLES } from "../../domain/constants/otp-roles.constants";


export const OtpRoleSchema = z.enum([
  OTP_ROLES.CANDIDATE,
  OTP_ROLES.RECRUITER,
]);

export const RequestEmailUpdateSchema = z.object({
  newEmail: z
    .string()
    .email("Invalid email address"),
});


export const VerifyEmailUpdateSchema = z.object({
  newEmail: z
    .string()
    .email("Invalid email address"),

  otp: z
    .string()
    .regex(/^\d{4,6}$/, "OTP must be 4–6 digits"),

  role: OtpRoleSchema,
});
