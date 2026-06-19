import { UserRepository } from "../../../domain/repositories/user.repository";
import { Password } from "../../../domain/value.objects/password-hash.vo";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { PasswordHasherPort } from "../../../domain/ports/password-hasher.port";
import { AuthTokenServicePort } from "../../ports/token.service.ports";
import { ResetPasswordDTO } from "../../../presentation/validators/reset-password.schema";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";

export class ResetPasswordUseCase implements UseCase<ResetPasswordDTO, void> {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly hasher: PasswordHasherPort,
    private readonly tokenService: AuthTokenServicePort,
  ) {}

  async execute(Request: ResetPasswordDTO): Promise<void> {
    if (!Request.token) {
      throw new ApplicationError(ERROR_CODES.INVALID_OR_EXPIRED_TOKEN);
    }

    if (!Request.newPassword) {
      throw new ApplicationError(ERROR_CODES.INVALID_PASSWORD);
    }

    let decoded: { userId: string };

    try {
      decoded = this.tokenService.verifyPasswordResetToken(Request.token);
    } catch {
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

    if (!user.isLocalUser()) {
      throw new ApplicationError(ERROR_CODES.PASSWORD_CHANGE_NOT_ALLOWED);
    }

    let newPassword: Password;

    try {
      newPassword = Password.create(Request.newPassword);
    } catch {
      throw new ApplicationError(ERROR_CODES.INVALID_PASSWORD);
    }

    const newHash = await this.hasher.hash(newPassword);
    const updatedUser = user.changePasswordHash(newHash);
    await this.userRepo.save(updatedUser);
  }
}
