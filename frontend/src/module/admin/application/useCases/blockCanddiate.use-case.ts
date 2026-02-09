import type { UserRepositry } from "../../domain/repositories/user.Repository";

export class BlockUserUseCase {
  private readonly userRepo: UserRepositry;

  constructor(userRepo: UserRepositry) {
    this.userRepo = userRepo;
  }

  async execute(userId: string): Promise<void> {
    if (typeof userId !== "string") {
      throw new Error("Invalid userId : must be string");
    }
    return this.userRepo.blockUser(userId);
  }
}
