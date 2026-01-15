import { UserRepository } from "../../domain/repositories/user.repository";
import { TokenServicePort } from "../ports/token.service.ports";

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tokenService: TokenServicePort
  ) {}
  async execute(refreshToken: string) {
    const payload = this.tokenService.verifyToken(refreshToken);
    const user = await this.userRepo.findById(payload.userId);

    if (!user || !user.isActive) {
      throw new Error("Account deactivated please contact the admin");
    }

    return this.tokenService.generateToken(user).accessToken;
  }
}
