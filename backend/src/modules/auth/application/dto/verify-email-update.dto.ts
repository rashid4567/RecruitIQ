import { OtpRole } from "../../domain/constants/otp-roles.constants";


export interface VerifyEmailUpdateDTO {
  userId: string;
  newEmail: string;
  otp: string;
  context: OtpRole;
}