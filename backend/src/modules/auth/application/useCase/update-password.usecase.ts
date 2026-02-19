import { PasswordHasherPort } from "../../domain/ports/password-hasher.port";
import { UserRepository } from "../../domain/repositories/user.repository";
import { Password } from "../../../../shared/value-objects.ts/password.vo";
import { ERROR_CODES } from "../constants/error-codes.constants";
import { ApplicationError } from "../../../../shared/errors/applicatoin.error";

export class UpdatePasswordUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly hasher: PasswordHasherPort,
  ) {}

  async execute(params: {
    userId: string;
    current: string;
    next: string;
  }): Promise<void> {
    const user = await this.userRepo.findById(params.userId);

    if (!user) {
      throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);
    }

    if (!user.isLocalUser()) {
      throw new ApplicationError(ERROR_CODES.PASSWORD_CHANGE_NOT_ALLOWED);
    }

    const currentPassword = Password.create(params.current);
    const nextPassword = Password.create(params.next);

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
