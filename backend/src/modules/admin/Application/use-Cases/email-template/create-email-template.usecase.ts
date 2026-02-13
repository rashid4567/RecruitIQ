import { EmailTemplate } from "../../../Domain/entities/email-template.entity";
import { EmailTemplateRepository } from "../../../Domain/repositories/email-template.repository";
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
      throw new Error(`Email template for event ${input.event} already exists`);
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
