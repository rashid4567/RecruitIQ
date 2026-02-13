import { OtpRole } from "../../domain/constants/otp-roles.constants";
import { Email } from "../../../../shared/domain/value-objects.ts/email.vo";

export interface OTPServicePort {
  create(email: Email, role: OtpRole): Promise<void>;
  verify(
    email: Email,
    otp: string,
    role: OtpRole
  ): Promise<void>;
}