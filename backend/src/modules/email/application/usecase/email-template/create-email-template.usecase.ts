import { ApplicationError } from "../../Errors/application.error";
import { EmailTemplate } from "../../../domain/entities/email-template.entity";
import { EmailTemplateRepository } from "../../../domain/repository/email-template.repository"; 
import { ERROR_CODES } from "../../Errors/error.codes";
import { CreateEmailTemplateInputDto } from "../../dto/email.template/createEmailTemplate.input.dto";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";

export class CreateEmailTemplateUseCase implements UseCase<CreateEmailTemplateInputDto,EmailTemplate> {
  constructor(
    private readonly emailTemplateRepository: EmailTemplateRepository,
  ) {}

  async execute(input: CreateEmailTemplateInputDto): Promise<EmailTemplate> {
    const existing = await this.emailTemplateRepository.findByEvent(
      input.event,
    );
    if (existing) {
      throw new ApplicationError(ERROR_CODES.EMAIL_TEMPLATE_EXISTS);
    }

    const template = new EmailTemplate(
      "",
      input.name,
      input.event,
      input.subject,
      input.body,
      true,
      new Date(),
    );

    return this.emailTemplateRepository.create(template);
  }
}
