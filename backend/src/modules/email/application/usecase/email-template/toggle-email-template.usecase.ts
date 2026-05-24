import { ApplicationError } from "../../Errors/application.error";
import { EmailTemplateRepository } from "../../../domain/repository/email-template.repository";
import { ERROR_CODES } from "../../Errors/error.codes";

export class toggleEmailTemplateUseCase {
  constructor(private readonly EmailTemplateRepo: EmailTemplateRepository) {}

  async execute(id: string) {
   const template = await this.EmailTemplateRepo.findById(id);
   if(!template){
    throw new ApplicationError(ERROR_CODES.EMAIL_TEMPLATE_NOT_FOUND)
   }

   template.toggleStatus();

   await this.EmailTemplateRepo.update(template);
   return template;
  }
}
