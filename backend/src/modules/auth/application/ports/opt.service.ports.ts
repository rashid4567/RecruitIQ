export interface OTPServicePort {
  create(email: string, role: "candidate" | "recruiter"): Promise<void>;
  verify(
    email: string,
    otp: string,
    role: "candidate" | "recruiter"
  ): Promise<void>;
}