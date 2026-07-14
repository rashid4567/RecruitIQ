import { OTPServicePort } from "../../ports/otp.service.ports";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { Email } from "../../../domain/value.objects/email.vo";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { VerifyEmailUpdateDTO } from "../../dto/verify-email-update.dto";
import { INFRA_ERRORS } from "../../../infrastructure/constants/error-messages.constants";


export class VerifyEmailUpdateUseCase implements IUseCase<
  VerifyEmailUpdateDTO,
  void
> {
  constructor(
    private readonly otpService: OTPServicePort,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(input: VerifyEmailUpdateDTO): Promise<void> {
    const email = Email.create(input.newEmail);
    try {
      await this.otpService.verify(email, input.otp, input.context);
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case INFRA_ERRORS.INVALID_OTP:
            throw new ApplicationError(ERROR_CODES.INVALID_OTP);
          case INFRA_ERRORS.OTP_EXPIRED:
            throw new ApplicationError(ERROR_CODES.OTP_EXPIRED);
          case INFRA_ERRORS.OTP_NOT_FOUND:
            throw new ApplicationError(ERROR_CODES.OTP_NOT_FOUND);
        }
      }

      throw error;
    }

    const user = await this.userRepo.findById(input.userId);
    if (!user) {
      throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);
    }
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser && existingUser.id !== user.id) {
      throw new ApplicationError(ERROR_CODES.EMAIL_ALREADY_EXISTS);
    }
    const updatedUser = user.updateEmail(email);
    await this.userRepo.save(updatedUser);
  }
}
