import { UserRepository } from "../../domain/repositories/user.repository";
import { Email } from "../../../../shared/value-objects.ts/email.vo.ts";

import { ERROR_CODES } from "../constants/error-codes.constants";
import { ApplicationError } from "../errors/application.error";
import { AuthTokenServicePort } from "../ports/token.service.ports";
import { EmailServicePort } from "../ports/email.service.port";

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tokenService: AuthTokenServicePort,
    private readonly emailService: EmailServicePort,
  ) {}

  async execute(emailRaw: string): Promise<void> {
    const email = Email.create(emailRaw);

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      return;
    }

    if(!user.id){
      throw new ApplicationError(ERROR_CODES.USER_ID_NOT_FOUND)
    }

    if (!user.authProvider.isLocal()) {
      throw new ApplicationError(ERROR_CODES.PASSWORD_RESET_NOT_ALLOWED);
    }

    const token =
      this.tokenService.generatePasswordResetToken(user.id);

    await this.emailService.sendPasswordResetLink(
      email.getValue(),
      token,
    );
  }
}
