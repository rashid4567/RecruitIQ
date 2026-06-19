import { OtpRole } from "../../domain/constants/otp-roles.constants";

export interface SendRegistrationOTPRequest {
  email: string;
  role: OtpRole;
}