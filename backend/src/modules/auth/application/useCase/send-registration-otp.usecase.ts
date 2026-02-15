import { UserRepository } from "../../domain/repositories/user.repository";
import { Email } from "../../../../shared/value-objects.ts/email.vo";
import { ERROR_CODES } from "../constants/error-codes.constants";
import { ApplicationError } from "../errors/application.error";
import { OTPServicePort } from "../ports/otp.service.ports";
import { OtpRole } from "../../domain/constants/otp-roles.constants";

export class SendRegistrationOTPUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly otpService: OTPServicePort,
  ) {}

  async execute(EmailRaw: string, role: OtpRole) {
    const email = Email.create(EmailRaw);

    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new ApplicationError(ERROR_CODES.EMAIL_ALREADY_EXISTS);
    }

    await this.otpService.create(email, role);
  }
}
