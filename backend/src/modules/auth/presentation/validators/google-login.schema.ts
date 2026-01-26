import { z } from "zod";
import { OTP_ROLES } from "../constants/otp-role";

export const GoogleLoginSchema = z.object({
  credential: z.string().min(10),
  role: z.enum(OTP_ROLES).optional(),
});

export type GoogleLoginDTO = z.infer<typeof GoogleLoginSchema>;
