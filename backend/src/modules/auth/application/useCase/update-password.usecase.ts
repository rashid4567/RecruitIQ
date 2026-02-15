import { PasswordHasherPort } from "../../domain/ports/password-hasher.port";
import { UserRepository } from "../../domain/repositories/user.repository";
import { Password } from "../../../../shared/value-objects.ts/password.vo";
import { ERROR_CODES } from "../constants/error-codes.constants";
import { ApplicationError } from "../errors/application.error";

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

    const current = Password.create(params.current);
    const next = Password.create(params.next);

    const updateUser = await user.updatePassword(
        current,
        next,
        this.hasher,
    )

    await this.userRepo.save(updateUser)
  }
}
