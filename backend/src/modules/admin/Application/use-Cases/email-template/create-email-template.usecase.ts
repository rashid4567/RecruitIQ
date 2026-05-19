import { ApplicationError } from "../../../../../shared/errors/application.error";
import { EmailTemplate } from "../../../Domain/entities/email-template.entity";
import { EmailTemplateRepository } from "../../../Domain/repositories/email-template.repository";
import { ERROR_CODES } from "../../constants/errorcode.constants";
import { CreateEmailTemplateInputDto } from "../../dto/email.template/createEmailTemplate.input.dto";

export class CreateEmailTemplateUseCase {
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
