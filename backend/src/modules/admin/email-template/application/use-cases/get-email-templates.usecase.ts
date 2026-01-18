import { EmailTemplateRepository } from "../../domain/repostories/email-template.repository";

export class GetEmailTemplateUseCase{
    constructor(
        private readonly EmailTemplateRepo : EmailTemplateRepository,
    ){};
    async execute(){
        return this.EmailTemplateRepo.findAll()
    }
}