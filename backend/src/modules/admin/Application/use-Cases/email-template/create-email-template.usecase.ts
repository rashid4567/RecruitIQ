import { EmailTemplate } from "../../../Domain/entities/email-template.entity";
import { EmailTemplateRepository } from "../../../Domain/repositories/email-template.repository";
import { EmailEvent } from "../../../Domain/constatns/email-enum.events";

interface CreateEmailTemplateInput {
  name: string;
  event: EmailEvent;
  subject: string;
  body: string;
}

export class CreateEmailTemplateUseCase {
  constructor(
    private readonly emailTemplateRepository: EmailTemplateRepository
  ) {}

  async execute(input: CreateEmailTemplateInput): Promise<EmailTemplate> {
   const existing = await this.emailTemplateRepository.findByEvent(input.event);
   if(existing){
    throw new Error(`Email template for event ${input.event} already exists`)
   }

    const template = new EmailTemplate(
      "",
      input.name,
      input.event,
      input.subject,
      input.body,
      true,
      new Date()
    );

    return this.emailTemplateRepository.create(template);
  }
}