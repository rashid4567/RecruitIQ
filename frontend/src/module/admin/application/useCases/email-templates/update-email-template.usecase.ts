import type { EmailTemplate } from "@/module/admin/domain/entities/email-template.entity";
import type { EmailTempleteRepository } from "@/module/admin/domain/repositories/email-template.repository";

export class UpdateEmailTemplateUseCase {
  private readonly EmailTempleteRepo: EmailTempleteRepository;
  constructor(EmailTempleteRepo: EmailTempleteRepository) {
    this.EmailTempleteRepo = EmailTempleteRepo;
  }

  async execute(
    id: string,
    payload: {
      subject?: string;
      body?: string;
    },
  ): Promise<EmailTemplate> {
    return this.EmailTempleteRepo.update(id, payload);
  }
}
