import { ApplicationError } from "../../../../../shared/errors/application.error";
import { EmailTemplateRepository } from "../../../domain/repository/email-template.repository";
import { EmailService } from "../../ports/email.service";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { SendTestEmailInputDto } from "../../dto/email.template/sent-test.email.input";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";

export class SendTestEmailUseCase implements IUseCase<SendTestEmailInputDto,void>{
  constructor(
    private readonly emailTemplateRepo: EmailTemplateRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(input: SendTestEmailInputDto): Promise<void> {
    const template = await this.emailTemplateRepo.findById(input.templateId);

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
