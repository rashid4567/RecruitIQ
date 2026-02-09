import type { UserRepositry } from "../../domain/repositories/user.Repository";

export class UnblockUserUseCase {
  private readonly userRepo: UserRepositry;
  constructor(userRepo: UserRepositry) {
    this.userRepo = userRepo;
  }

  async execute(userID: string): Promise<void> {
    if (typeof userID !== "string") {
      throw new Error("Invalid userID  : must be string");
    }
    return this.userRepo.unblockUser(userID);
  }
}
