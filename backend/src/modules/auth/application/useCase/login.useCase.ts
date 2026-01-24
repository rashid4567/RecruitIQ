import { UserRepository } from "../../domain/repositories/user.repository";
import { PasswordHasherPort } from "../ports/password.service.port";
import { TokenServicePort } from "../ports/token.service.ports";
import { User } from "../../domain/entities/user.entity";
import { Email } from "../../domain/value.objects.ts/email.vo";
import { Password } from "../../domain/value.objects.ts/password.vo";
import { ERROR_CODES } from "../constants/error-codes.constants";
import { ApplicationError } from "../errors/application.error";
import { SUCCESS_CODES } from "../constants/success-code.contents";

export class LoginUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(emailRaw: string, passwordRaw: string) {
    const email = Email.create(emailRaw);
    const password = Password.create(passwordRaw);

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new ApplicationError(ERROR_CODES.INVALID_CREDENTIALS);
    }

    if (!user.canLogin()) {
      throw new ApplicationError(ERROR_CODES.ACCOUNT_DEACTIVATED);
    }

    const authenticated = await user.verifyPassword(
      password,
      this.passwordHasher,
    );
    if (!authenticated) {
      throw new ApplicationError(ERROR_CODES.INVALID_CREDENTIALS);
    }

    return {
      code: SUCCESS_CODES.LOGIN_SUCCESS,
      userId: user.id,
    };
  }
}
