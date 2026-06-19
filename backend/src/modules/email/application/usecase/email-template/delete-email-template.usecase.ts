
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { EmailTemplateRepository } from "../../../domain/repository/email-template.repository"; 
import { DeleteEmailTemplateRequestDTO } from "../../dto/email.template/deleteEmailTemplateDTO";
import { ApplicationError } from "../../Errors/application.error";
import { ERROR_CODES } from "../../Errors/error.codes";

export class DeleteEmailTemplateUseCase implements UseCase<
    DeleteEmailTemplateRequestDTO,
    void
  > {
  constructor(
    private readonly emailTemplateRepo: EmailTemplateRepository
  ) {}

  async execute(request : DeleteEmailTemplateRequestDTO): Promise<void> {
    const exists = await this.emailTemplateRepo.findById(request.id);

    if (!exists) {
      throw new ApplicationError(ERROR_CODES.EMAIL_TEMPLATE_NOT_FOUND)
    }

    await this.emailTemplateRepo.delete(request.id);
  }
}
