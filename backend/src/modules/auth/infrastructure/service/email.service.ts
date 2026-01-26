import { EmailServicePort } from "../../application/ports/email.service.port";
import { sendPasswordLink } from "../../../../utils/email";

export class EmailService implements EmailServicePort {
  async sendPasswordResetLink(
    email: string,
    token: string
  ): Promise<void> {
    await sendPasswordLink(
      email,
      `${process.env.FRONTEND_URL}/reset-password?token=${token}`
    );
  }
}
