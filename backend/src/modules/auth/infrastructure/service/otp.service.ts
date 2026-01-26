import { sendOtp } from "../../../../utils/email";
import { generateOTP, hashOTP } from "../security/otp.crypto";
import { OTPServicePort } from "../../application/ports/otp.service.ports";
import { Email } from "../../domain/value.objects.ts/email.vo";
import { INFRA_ERRORS } from "../constants/error-messages.constants";
import { otpModel } from "../mongoose/model/otp.model";
import { OtpRole } from "../../domain/constants/otp-roles.constants";

const OTP_EXPIRY_MS = 10 * 60 * 1000;
export class OTPService implements OTPServicePort {
  async create(email: Email, role: OtpRole): Promise<void> {
    const otp = generateOTP();
    const emailValue = email.getValue();

    await otpModel.deleteMany({ email: emailValue, role });

    await otpModel.create({
      email: emailValue,
      role,
      otpHash: hashOTP(otp),
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
    });

    await sendOtp(emailValue, otp);
  }

  async verify(email: Email, otp: string, role: OtpRole): Promise<void> {
    const emailValue = email.getValue();
    const record = await otpModel.findOne({ email: emailValue, role });
    if (!record) {
      throw new Error(INFRA_ERRORS.OTP_NOT_FOUND);
    }
    if (record.expiresAt < new Date()) {
      throw new Error(INFRA_ERRORS.OTP_EXPIRED);
    }
    if (hashOTP(otp) !== record.otpHash) {
      throw new Error(INFRA_ERRORS.INVALID_OTP);
    }
    await otpModel.deleteMany({ email: emailValue, role });
  }
}
