import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { EmailTemplate } from "../../../domain/entities/email-template.entity";
import { EmailTemplateRepository } from "../../../domain/repository/email-template.repository";

export class GetEmailTemplatesUseCase implements UseCase<
  void,
  EmailTemplate[]
> {
  constructor(private readonly emailTemplateRepo: EmailTemplateRepository) {}

  async execute(): Promise<EmailTemplate[]> {
    return this.emailTemplateRepo.findAll();
  }
}
