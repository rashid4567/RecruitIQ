import { UserRepository } from "../../domain/repositories/user.repository";
import { Password } from "../../domain/value.objects.ts/password.vo";
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
    const { userId } = this.tokenService.verifyPasswordResetToken(token);

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);
    }

    const updatedUser = await user.resetPassword(
      Password.create(newPasswordRaw),
      this.hasher,
    );
    await this.userRepo.save(updatedUser);
  }
}
