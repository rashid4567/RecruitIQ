import nodemailer from "nodemailer";
import { EmailService } from "../../../email/application/ports/email.service";
import { logEmail } from "../../../email/infrastructure/logging/email-logger";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export class NodemailerEmailService implements EmailService {
  async send(data: {
    to: string;
    subject: string;
    body: string;
    type?: "REAL" | "TEST";
  }): Promise<void> {
    const { to, subject, body, type = "REAL" } = data;

    try {
      await transporter.sendMail({
        from: `"RecruitIQ" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: body,
      });

      logEmail({
        type,
        to,
        subject,
        status: "SENT",
      });
    } catch (error) {
      logEmail({
        type,
        to,
        subject,
        status: "FAILED",
        error: error instanceof Error ? error.message : "Unknown error",
      });

      throw error;
    }
  }
}
