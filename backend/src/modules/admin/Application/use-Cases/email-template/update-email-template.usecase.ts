import { EmailTemplateRepository } from "../../../Domain/repositories/email-template.repository";

export class UpdateEmailTemplateUseCase{
    constructor(
        private readonly EmailTemplateRepo : EmailTemplateRepository
    ){};

    async execute(id : string , data : {subject?: string, body ?: string}){
        const template = await this.EmailTemplateRepo.findById(id);
        if(!template)throw new Error("Template is not found")
        if(data.subject)template.subject = data.subject;
        if(data.body)template.body = data.body

        return this.EmailTemplateRepo.update(template);
    }
}