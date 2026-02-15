import { UserRepository } from "../../domain/repositories/user.repository";
import { PasswordHasherPort } from "../../domain/ports/password-hasher.port";

import { Email } from "../../../../shared/value-objects.ts/email.vo";
import { Password } from "../../../../shared/value-objects.ts/password.vo";
import { ERROR_CODES } from "../constants/error-codes.constants";
import { ApplicationError } from "../errors/application.error";

import { AuthTokenServicePort } from "../ports/token.service.ports";

export class LoginUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly tokenService : AuthTokenServicePort,
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

    if(!user.id){
      throw new ApplicationError(ERROR_CODES.USER_ID_NOT_FOUND)
    }

    return {
     accessToken : this.tokenService.generateAccessToken(user.id, user.role),
     refreshToken : this.tokenService.generateRefreshToken(user.id),
     userId : user.id,
    role : user.role,
    };
  }
}
