import type { EmailTempleteRepository } from "@/module/admin/domain/repositories/email-template.repository";


export class CreateEmailTemplateUseCase {

    private readonly emailTemplateRepo: EmailTempleteRepository
  constructor(
    emailTemplateRepo: EmailTempleteRepository
  ) {
    this.emailTemplateRepo = emailTemplateRepo
  }

  async execute(payload: {
    name: string;
    event: string;
    subject: string;
    body: string;
  }) {
    return this.emailTemplateRepo.create(payload);
  }
}
