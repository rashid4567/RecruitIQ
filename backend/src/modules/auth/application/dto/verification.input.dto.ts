export interface VerificationInput {
  email: string;
  otp: string;
  password: string;
  fullName: string;
  role: "candidate" | "recruiter";
}
