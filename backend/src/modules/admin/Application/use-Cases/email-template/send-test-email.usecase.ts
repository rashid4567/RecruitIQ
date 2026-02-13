import { ApplicationError } from "../../../../../shared/errors/applicatoin.error";
import { EmailTemplateRepository } from "../../../Domain/repositories/email-template.repository";
import { EmailService } from "../../../Domain/services/email.service";
import { ERROR_CODES } from "../../constants/errorcode.constants";
import { SendTestEmailInputDto } from "../../dto/email.template/sent-test.email.input";

export class SendTestEmailUseCase {
  constructor(
    private readonly emailTempleteRepo: EmailTemplateRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(input: SendTestEmailInputDto): Promise<void> {
    const template = await this.emailTempleteRepo.findById(input.templateId);

    if (!template)
      throw new ApplicationError(ERROR_CODES.EMAIL_TEMPLATE_NOT_FOUND);
    if (!template.isActive)
      throw new ApplicationError(ERROR_CODES.EMAIL_TEMPLATE_IS_NOT_ACTIVE);

    await this.emailService.send({
      to: input.to,
      subject: template.subject,
      body: template.body,
      type: "TEST",
    });
  }
}
