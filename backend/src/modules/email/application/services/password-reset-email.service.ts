import { EmailService } from "../../../email/application/ports/email.service";
import { passwordResetTemplate } from "../templates/password-reset.template";

export class PasswordResetEmailService {
  constructor(private readonly emailService: EmailService) {}

  async send(
    to: string,

    link: string,
  ) {
    await this.emailService.send({
      to,
      subject: "Reset Password",
      body: passwordResetTemplate(link),
      type: "REAL",
    });
  }
}
