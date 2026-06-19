import { OtpRole } from "../../domain/constants/otp-roles.constants";

export interface RequestEmailUpdateDTO {
  userId: string;
  newEmail: string;
  role: OtpRole;
}