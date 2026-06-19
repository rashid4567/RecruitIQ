import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { EmailTemplate } from "../../../domain/entities/email-template.entity";
import { EmailTemplateRepository } from "../../../domain/repository/email-template.repository";
import { UpdateEmailTemplateRequestDTO } from "../../dto/email.template/updateEmailTemplate.input.dto";

import { ApplicationError } from "../../Errors/application.error";
import { ERROR_CODES } from "../../Errors/error.codes";

export class UpdateEmailTemplateUseCase implements UseCase<
  UpdateEmailTemplateRequestDTO,
  EmailTemplate
> {
  constructor(private readonly emailTemplateRepo: EmailTemplateRepository) {}

  async execute(input: UpdateEmailTemplateRequestDTO): Promise<EmailTemplate> {
    const template = await this.emailTemplateRepo.findById(input.id);

    if (!template) {
      throw new ApplicationError(ERROR_CODES.EMAIL_TEMPLATE_NOT_FOUND);
    }

    template.updateContent(
      input.input.subject ?? template.subject,
      input.input.body ?? template.body,
    );

    return this.emailTemplateRepo.update(template);
  }
}
