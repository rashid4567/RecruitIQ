//import { PasswordResetRepository } from "../../domain/repositories/password-reset.repository";
import { UserRepository } from "../../domain/repositories/user.repository";
import { Password } from "../../domain/value.objects.ts/password.vo";
import { ResetToken } from "../../domain/value.objects.ts/reset-token.vo";
import { TokenService } from "../../infrastructure/service/token.service";
import { ERROR_CODES } from "../constants/error-codes.constants";
import { ApplicationError } from "../errors/application.error";
import { PasswordHasherPort } from "../ports/password.service.port";
import { AuthTokenServicePort } from "../ports/token.service.ports";

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly tokenService: AuthTokenServicePort,
  ) {}

  async execute(token: string, newPasswordRaw: string): Promise<void> {
    const { userId } = this.tokenService.verifyPasswordResetToken(token);

    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);
    }

    if (!user.authProvider.isLocal()) {
      throw new ApplicationError(ERROR_CODES.PASSWORD_RESET_NOT_ALLOWED);
    }

    const password = Password.create(newPasswordRaw);
    const passwordHash = await this.passwordHasher.hash(password);
    const updatePassword = user.changePassword(passwordHash);
    await this.userRepo.save(updatePassword);
  }
}
