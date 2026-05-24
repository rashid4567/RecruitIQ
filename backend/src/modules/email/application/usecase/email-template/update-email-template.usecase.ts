import { EmailTemplateRepository } from "../../../domain/repository/email-template.repository";
import { UpdateEmailTemplateInputDto } from "../../dto/email.template/updateEmailTemplate.input.dto";
import { ApplicationError } from "../../Errors/application.error";
import { ERROR_CODES } from "../../Errors/error.codes";

export class UpdateEmailTemplateUseCase{
  constructor(private readonly emailTemplateRepo : EmailTemplateRepository){};

  async execute(id : string, input : UpdateEmailTemplateInputDto){
    const template = await this.emailTemplateRepo.findById(id);

    if(!template){
      throw new ApplicationError(ERROR_CODES.EMAIL_TEMPLATE_NOT_FOUND)
    }
    template.updateContent(input.subject ?? template.subject,
      input.body ?? template.body,
    )

    return await this.emailTemplateRepo.update(template)
  }
}