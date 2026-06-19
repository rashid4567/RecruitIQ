import { UserRepository } from "../../../domain/repositories/user.repository";
import { Email } from "../../../domain/value.objects/email.vo";
import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { OTPServicePort } from "../../ports/otp.service.ports";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { SendRegistrationOTPRequest } from "../../dto/sendRegistration.otp.DTO";

export class SendRegistrationOTPUseCase implements UseCase<
  SendRegistrationOTPRequest,
  void
> {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly otpService: OTPServicePort,
  ) {}

  async execute(Request: SendRegistrationOTPRequest): Promise<void> {
    const email = Email.create(Request.email);

    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new ApplicationError(ERROR_CODES.EMAIL_ALREADY_EXISTS);
    }

    await this.otpService.create(email, Request.role);
  }
}
