import { EmailTemplateRepository } from "../../../domain/repository/email-template.repository";
import { EmailService } from "../../ports/email.service";
import { sendEmailByInputDto } from "../../dto/email.template/sentEmail.input.dto";
import { TemplateRendererService } from "../../services/template-renderer.service";
import { ApplicationError } from "../../Errors/application.error";
import { ERROR_CODES } from "../../Errors/error.codes";

export class SendEmailByEventUseCase {
  constructor(
    private readonly templateRepo: EmailTemplateRepository,

    private readonly emailService: EmailService,

    private readonly renderer: TemplateRendererService,
  ) {}

  async execute(input: sendEmailByInputDto): Promise<void> {
    const template = await this.templateRepo.findByEvent(input.event);

    if (!template) {
      return;
    }

    if (!template.isActive) {
      throw new ApplicationError(ERROR_CODES.EMAIL_TEMPLATE_IS_NOT_ACTIVE);
    }
    const subject = this.renderer.render(
      template.subject,

      input.variables,
    );
    const body = this.renderer.render(
      template.body,

      input.variables,
    );
    await this.emailService.send({
      to: input.to,
      subject,
      body,
      type: "REAL",
    });
  }
}
