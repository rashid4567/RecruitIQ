import type { AuthRepository } from "../../domain/repository/AuthRepository";

export class LogoutUseCase {
  private readonly authRepo: AuthRepository;
  constructor(authRepo: AuthRepository) {
    this.authRepo = authRepo;
  }

  async execute(): Promise<void> {
    await this.authRepo.logout();
  }
}
