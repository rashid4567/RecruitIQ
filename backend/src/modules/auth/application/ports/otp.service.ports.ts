import { OtpRole } from "../../domain/constants/otp-roles.constants";
import { Email } from "../../../../shared/value-objects.ts/email.vo.ts";

export interface OTPServicePort {
  create(email: Email, role: OtpRole): Promise<void>;
  verify(
    email: Email,
    otp: string,
    role: OtpRole
  ): Promise<void>;
}