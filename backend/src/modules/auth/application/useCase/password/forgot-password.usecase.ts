import { UserRepository } from "../../../domain/repositories/user.repository";
import { Email } from "../../../domain/value.objects/email.vo";

import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { AuthTokenServicePort } from "../../ports/token.service.ports";
import { EmailServicePort } from "../../ports/email.service.port";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { ForgotPasswordRequestDTO } from "../../dto/forgot-password.dto";

export class ForgotPasswordUseCase implements UseCase<ForgotPasswordRequestDTO,void>{
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tokenService: AuthTokenServicePort,
    private readonly emailService: EmailServicePort,
  ) {}

  async execute(Request : ForgotPasswordRequestDTO): Promise<void> {
    const email = Email.create(Request.email);

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);
    }
    if (!user.id) {
      throw new ApplicationError(ERROR_CODES.USER_ID_NOT_FOUND);
    }

    if (!user.authProvider.isLocal()) {
      throw new ApplicationError(
        ERROR_CODES.GOOGLE_ACCOUNT_PASSWORD_RESET_NOT_ALLOWED,
      );
    }

    const token = this.tokenService.generatePasswordResetToken(user.id);

    await this.emailService.sendPasswordResetLink(email.getValue(), token);
  }
}
