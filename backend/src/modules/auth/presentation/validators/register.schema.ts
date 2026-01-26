
import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  password: z.string().min(8),
  fullName: z.string().min(2),
  role: z.enum(["candidate", "recruiter"]),
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;
