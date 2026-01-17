import { UserRepository } from "../../domain/repositories/user.repository";
import { TokenService } from "../../infrastructure/service/token.service";
import { sendPasswordLink } from "../../../../utils/email";
import { TokenServicePort } from "../ports/token.service.ports";

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: TokenServicePort,

  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) return;
    if(user.authProvider !== "local")throw new Error("Socail account doesn't have password")
    const token = this.jwtService.generatePasswordResetToken(user.id);

    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendPasswordLink(user.email, link);
  }
}
