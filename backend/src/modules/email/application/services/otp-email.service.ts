import { EmailService } from "../ports/email.service";
import { otpTemplate } from "../templates/otp.template";

export class OtpEmailService {
  constructor(private readonly emailService: EmailService) {}

  async send(
    to: string,
    otp: string,
  ) {
    await this.emailService.send({
      to,
      subject: "Email Verification OTP",
      body: otpTemplate(otp),
      type: "REAL",
    });
  }
}
