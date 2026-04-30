import { ApplicationError } from "../../../../../shared/errors/application.error";
import { EmailTemplateRepository } from "../../../Domain/repositories/email-template.repository";
import { ERROR_CODES } from "../../constants/errorcode.constants";

export class DeleteEmailTemplateUseCase {
  constructor(
    private readonly emailTemplateRepo: EmailTemplateRepository
  ) {}

  async execute(id: string): Promise<void> {
    const exists = await this.emailTemplateRepo.findById(id);

    if (!exists) {
      throw new ApplicationError(ERROR_CODES.EMAIL_TEMPLATE_NOT_FOUND)
    }

    await this.emailTemplateRepo.delete(id);
  }
}
