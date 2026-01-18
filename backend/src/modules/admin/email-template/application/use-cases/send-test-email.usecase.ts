import { EmailTemplateRepository } from "../../domain/repostories/email-template.repository";
import { sendTestEmail } from "../../../../../utils/email";

interface SendTestEmailInput {
  templateId: string;
  to: string;
}

export class SendTestEmailUseCase {
  constructor(
    private readonly emailTemplateRepo: EmailTemplateRepository
  ) {}

  async execute(input: SendTestEmailInput): Promise<void> {
    const template = await this.emailTemplateRepo.findById(input.templateId);

    if (!template) {
      throw new Error("Email template not found");
    }

    if (!template.isActive) {
      throw new Error("Email template is not active");
    }

    await sendTestEmail(
      input.to,
      template.subject,
      template.body
    );
  }
}
