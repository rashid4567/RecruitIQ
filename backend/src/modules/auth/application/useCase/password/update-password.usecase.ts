import { PasswordHasherPort } from "../../../domain/ports/password-hasher.port";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { Password } from "../../../domain/value.objects/password-hash.vo";
import { ERROR_CODES } from "../../constants/error-codes.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { RequestUpdatePassword } from "../../dto/UpdatePasswordDTO";

export class UpdatePasswordUseCase implements UseCase<
  RequestUpdatePassword,
  void
> {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly hasher: PasswordHasherPort,
  ) {}

  async execute(Request: RequestUpdatePassword): Promise<void> {
    const user = await this.userRepo.findById(Request.userId);

    if (!user) {
      throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);
    }

    if (!user.isLocalUser()) {
      throw new ApplicationError(
        ERROR_CODES.GOOGLE_ACCOUNT_PASSWORD_CHANGE_NOT_ALLOWED,
      );
    }

    const currentPassword = Password.create(Request.current);
    const nextPassword = Password.create(Request.next);
    const storedHash = user.getPasswordHash();

    if (!storedHash) {
      throw new ApplicationError(ERROR_CODES.PASSWORD_NOT_SET);
    }

    const match = await this.hasher.compare(currentPassword, storedHash);
    if (!match) {
      throw new ApplicationError(ERROR_CODES.INVALID_CURRENT_PASSWORD);
    }

    const samePassword = await this.hasher.compare(nextPassword, storedHash);
    if (samePassword) {
      throw new ApplicationError(ERROR_CODES.PASSWORD_SAME_AS_OLD);
    }

    const newHash = await this.hasher.hash(nextPassword);
    const updatedUser = user.changePasswordHash(newHash);
    await this.userRepo.save(updatedUser);
  }
}
