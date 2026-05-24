import { EmailServicePort } from
"../../application/ports/email.service.port";
import { PasswordResetEmailService } from "../../../email/application/services/password-reset-email.service";


export class AuthEmailService
implements EmailServicePort {

  constructor(
   private readonly passwordResetEmailService : PasswordResetEmailService
  ) {}

  async sendPasswordResetLink(
    email: string,
    token: string,
  ): Promise<void> {

    const frontendUrl =
      process.env.FRONTEND_URL;

    if (!frontendUrl) {
      throw new Error(
        "FRONTEND_URL not configured",
      );
    }

    const resetLink =
      `${frontendUrl}/reset-password?token=${token}`;

    await this.passwordResetEmailService.send(
      email,
      resetLink,
    );
  }
} 