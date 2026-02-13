import type { AuthRepository } from "../../domain/repository/AuthRepository";
import { Password } from "../../domain/value-object/password.vo";

export class UpdatePasswordUsecase {
  private readonly authRepo: AuthRepository;
  constructor(authRepo: AuthRepository) {
    this.authRepo = authRepo;
  }

  async execute(input: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    const current = Password.create(input.currentPassword);
    const next = Password.create(input.newPassword);

    await this.authRepo.updatePassword(current, next);
  }
}
