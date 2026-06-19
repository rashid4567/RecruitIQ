import { ApplicationError } from "../../Errors/application.error";
import { EmailTemplateRepository } from "../../../domain/repository/email-template.repository";
import { ERROR_CODES } from "../../Errors/error.codes";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { ToggleEmailTemplateRequestDTO } from "../../dto/email.template/toggleEmail.template.input.dto";
import { EmailTemplate } from "../../../domain/entities/email-template.entity";

export class toggleEmailTemplateUseCase implements UseCase<
  ToggleEmailTemplateRequestDTO,
  EmailTemplate
> {
  constructor(private readonly EmailTemplateRepo: EmailTemplateRepository) {}

  async execute(
    request: ToggleEmailTemplateRequestDTO,
  ): Promise<EmailTemplate> {
    const template = await this.EmailTemplateRepo.findById(request.id);
    if (!template) {
      throw new ApplicationError(ERROR_CODES.EMAIL_TEMPLATE_NOT_FOUND);
    }

    template.toggleStatus();

    await this.EmailTemplateRepo.update(template);
    return template;
  }
}
