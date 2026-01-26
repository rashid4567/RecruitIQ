import { z } from "zod";
import { OTP_ROLES } from "../constants/otp-role";

export const SendOtpSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(OTP_ROLES),
});
