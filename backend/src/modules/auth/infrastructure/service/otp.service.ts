import { hashOTP } from "../security/otp.crypto";
import { generateOTP } from "../../domain/services/otp-generator.service";
import { OTPServicePort } from "../../application/ports/otp.service.ports";
import { Email } from "../../domain/value.objects/email.vo";
import { INFRA_ERRORS } from "../constants/error-messages.constants";
import { otpModel } from "../mongoose/model/otp.model";
import { OtpRole } from "../../domain/constants/otp-roles.constants";
import { OtpEmailService } from "../../../email/application/services/otp-email.service";
const OTP_EXPIRY_MS = 10 * 60 * 1000;

export class OTPService implements OTPServicePort {
  constructor(private readonly otpEmailService: OtpEmailService) {}

  async create(
    email: Email,

    role: OtpRole,
  ): Promise<void> {
    const otp = generateOTP();
    const emailValue = email.getValue();
    await otpModel.deleteMany({
      email: emailValue,
      role,
    });
    await otpModel.create({
      email: emailValue,
      role,
      otpHash: hashOTP(otp),
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
    });
    await this.otpEmailService.send(emailValue, otp);
  }

  async verify(
    email: Email,
    otp: string,
    role: OtpRole,
  ): Promise<void> {
    const emailValue = email.getValue();
    const record = await otpModel.findOne({
      email: emailValue,
      role,
    });

    if (!record) {
      throw new Error(INFRA_ERRORS.OTP_NOT_FOUND);
    }
    if (record.expiresAt < new Date()) {
      throw new Error(INFRA_ERRORS.OTP_EXPIRED);
    }
    if (hashOTP(otp) !== record.otpHash) {
      throw new Error(INFRA_ERRORS.INVALID_OTP);
    }
    await otpModel.deleteMany({
      email: emailValue,

      role,
    });
  }
}
