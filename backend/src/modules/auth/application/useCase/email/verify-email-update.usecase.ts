import { OTPServicePort } from "../../ports/otp.service.ports";
import { OtpRole } from "../../../domain/constants/otp-roles.constants";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { Email } from "../../../domain/value.objects/email.vo";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { VerifyEmailUpdateDTO } from "../../dto/verify-email-update.dto";

export class VerifyEmailUpdateUseCase implements UseCase<
  VerifyEmailUpdateDTO,
  void
> {
  constructor(
    private readonly otpService: OTPServicePort,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(input: VerifyEmailUpdateDTO): Promise<void> {
    const email = Email.create(input.newEmail);

    await this.otpService.verify(email, input.otp, input.context);

    const user = await this.userRepo.findById(input.userId);
    if (!user) throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);

    const existing = await this.userRepo.findByEmail(email);
    if (existing && existing.id !== user.id) {
      throw new ApplicationError(ERROR_CODES.EMAIL_ALREADY_EXISTS);
    }

    const updatedUser = user.updateEmail(email);
    await this.userRepo.save(updatedUser);
  }
}
