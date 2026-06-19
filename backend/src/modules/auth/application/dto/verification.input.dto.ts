import { userRoles } from "../../domain/constants/roles.constants";

export interface VerificationInput {
  email: string;
  otp: string;
  password: string;
  fullName: string;
  role: "candidate" | "recruiter";
}

export interface VerifyRegistrationResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    role: userRoles;
    fullName: string;
  };
}