import { EmailTemplateRepository } from "../../../domain/repository/email-template.repository"

export class GetEmailTemplatesUseCase{
    constructor(
        private readonly emailTemplateRepo : EmailTemplateRepository,
    ){};
    async execute(){
        return this.emailTemplateRepo.findAll()
    }
}

