import { UserRepository } from "../../domain/repositories/user.repository";
import { TokenService } from "../../infrastructure/service/token.service";

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tokenService: TokenService
  ) {}
  async execute(refreshToken: string) {
    const payload = this.tokenService.verifyRefreshToken(refreshToken);
    const user = await this.userRepo.findById(payload.userId);

    if (!user || !user.isActive) {
      throw new Error("Account deactivated please contact the admin");
    }

    return this.tokenService.generateAccessToken(user);
  }
}
