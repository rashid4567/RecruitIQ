import { z } from "zod";
import { OTP_ROLES } from "../../domain/constants/otp-roles.constants"; 

export const SendOtpSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(OTP_ROLES),
});
