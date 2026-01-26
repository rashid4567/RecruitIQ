import { OtpRole } from "../constants/otp.roles.constants"; 
import { Email } from "../../domain/value-objects/email.vo";

export interface OTPServicePort {
  create(email: string, role: OtpRole): Promise<void>;
  verify(
    email: string,
    otp: string,
    role: OtpRole
  ): Promise<void>;
}