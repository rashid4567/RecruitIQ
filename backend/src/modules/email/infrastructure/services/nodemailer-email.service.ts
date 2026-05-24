import { EmailService } from "../../application/ports/email.service";

import { SendEmailDto } from "../../application/dto/email.template/send-email.dto";

import { transporter } from "../config/mail.config";

import { logEmail } from "../logging/email-logger";

export class NodemailerEmailService implements EmailService {
  async send(data: SendEmailDto): Promise<void> {
    try {
      await transporter.sendMail({
        from: `"RecruitIQ" <${process.env.EMAIL_USER}>`,

        to: data.to,

        subject: data.subject,

        html: data.body,
      });

      await logEmail({
        type: data.type ?? "REAL",

        to: data.to,

        subject: data.subject,

        status: "SENT",
      });
    } catch (err) {
      await logEmail({
        type: data.type ?? "REAL",

        to: data.to,

        subject: data.subject,

        status: "FAILED",

        error: err instanceof Error ? err.message : "Unknown",
      });

      throw err;
    }
  }
}
