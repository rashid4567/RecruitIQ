import { UserRepository } from "../../domain/repositories/user.repository";
import { Password } from "../../../../shared/value-objects.ts/password.vo";
import { ApplicationError } from "../errors/application.error";
import { ERROR_CODES } from "../constants/error-codes.constants";
import { PasswordHasherPort } from "../../domain/ports/password-hasher.port";
import { AuthTokenServicePort } from "../ports/token.service.ports";

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly hasher: PasswordHasherPort,
    private readonly tokenService: AuthTokenServicePort,
  ) {}

  async execute(token: string, newPasswordRaw: string): Promise<void> {
    if (!token) {
      throw new ApplicationError(ERROR_CODES.INVALID_OR_EXPIRED_TOKEN);
    }

    if (!newPasswordRaw) {
      throw new ApplicationError(ERROR_CODES.INVALID_PASSWORD);
    }

    let decoded: { userId: string };

    try {
      decoded = this.tokenService.verifyPasswordResetToken(token);
    } catch (error) {
      throw new ApplicationError(ERROR_CODES.INVALID_OR_EXPIRED_TOKEN);
    }

    const { userId } = decoded;

    if (!userId) {
      throw new ApplicationError(ERROR_CODES.INVALID_OR_EXPIRED_TOKEN);
    }

    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);
    }

    let newPassword: Password;

    try {
      newPassword = Password.create(newPasswordRaw);
    } catch {
      throw new ApplicationError(ERROR_CODES.INVALID_PASSWORD);
    }

    const updatedUser = await user.resetPassword(newPassword, this.hasher);
    await this.userRepo.save(updatedUser);
  }
}
