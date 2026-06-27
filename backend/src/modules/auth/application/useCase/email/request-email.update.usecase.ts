import { OTPServicePort } from "../../ports/otp.service.ports";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { Email } from "../../../domain/value.objects/email.vo";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants"; 
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { RequestEmailUpdateDTO } from "../../dto/EmailUpdateDTO";

export class RequestEmailUpdateUseCase implements IUseCase<
  RequestEmailUpdateDTO,
  void
> {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly otpService: OTPServicePort,
  ) {}

  async execute(Request: RequestEmailUpdateDTO): Promise<void> {
    const email = Email.create(Request.newEmail);

    const user = await this.userRepo.findById(Request.userId);
    if (!user) throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);

    if (user.email.equals(email)) {
      throw new ApplicationError(
        ERROR_CODES.NEW_EMAIL_MUST_BE_DIFFERENT_FROM_THE_CURRENT_EMAIL,
      );
    }

    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser)
      throw new ApplicationError(ERROR_CODES.EMAIL_ALREADY_EXISTS);

    await this.otpService.create(email, Request.role);
  }
}
