import { OTPServicePort } from "../ports/otp.service.ports";
import { UserRepository } from "../../domain/repositories/user.repository";
import { Email } from "../../../../shared/value-objects/email.vo";
import { OtpRole } from "../../domain/constants/otp-roles.constants";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { ERROR_CODES } from "../constants/error-codes.constants";

export class RequestEmailUpdateUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly otpService: OTPServicePort,
  ) {}

  async execute(userId: string, newEmail: string, role: OtpRole): Promise<void> {
    const email = Email.create(newEmail);

    const user = await this.userRepo.findById(userId);
    if (!user) throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);

    if (user.email.equals(email)) {
      throw new ApplicationError(ERROR_CODES.NEW_EMAIL_MUST_BE_DIFFERENT_FROM_THE_CURRENT_EMAIL);
    }

    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) throw new ApplicationError(ERROR_CODES.EMAIL_ALREADY_EXISTS);

    await this.otpService.create(email, role);
  }
}