import { ApplicationError } from "../../../../../shared/errors/application.error";
import { EmailTemplateRepository } from "../../../Domain/repositories/email-template.repository";
import { ERROR_CODES } from "../../constants/errorcode.constants";

export class UpdateEmailTemplateUseCase{
    constructor(
        private readonly EmailTemplateRepo : EmailTemplateRepository
    ){};

    async execute(id : string , data : {subject?: string, body ?: string}){
        const template = await this.EmailTemplateRepo.findById(id);
        if(!template)throw new ApplicationError(ERROR_CODES.EMAIL_TEMPLATE_NOT_FOUND)
        if(data.subject)template.subject = data.subject;
        if(data.body)template.body = data.body

        return this.EmailTemplateRepo.update(template);
    }
}