import { EmailTemplateRepository } from "../../../Domain/repositories/email-template.repository";

export class GetEmailTemplatesUseCase{
    constructor(
        private readonly EmailTemplateRepo : EmailTemplateRepository,
    ){};
    async execute(){
        return this.EmailTemplateRepo.findAll()
    }
}

