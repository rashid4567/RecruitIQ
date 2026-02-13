import { EmailTemplateRepository } from "../../../Domain/repositories/email-template.repository";

export class DeleteEmailTemplateUseCase {
  constructor(
    private readonly emailTemplateRepo: EmailTemplateRepository
  ) {}

  async execute(id: string): Promise<void> {
    const exists = await this.emailTemplateRepo.findById(id);

    if (!exists) {
      throw new Error("Email template not found");
    }

    await this.emailTemplateRepo.delete(id);
  }
}
