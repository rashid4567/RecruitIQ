import { Email } from "../../domain/value.objects.ts/email.vo";

export interface OTPServicePort {
  create(email: string, role: "candidate" | "recruiter"): Promise<void>;
  verify(
    email: Email,
    otp: string,
    role: "candidate" | "recruiter"
  ): Promise<void>;
}