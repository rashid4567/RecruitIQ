
import { EmailTemplateRepository } from "../../../domain/repository/email-template.repository"; 
import { ApplicationError } from "../../Errors/application.error";
import { ERROR_CODES } from "../../Errors/error.codes";

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
