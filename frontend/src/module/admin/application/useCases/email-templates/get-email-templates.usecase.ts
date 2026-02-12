import type { EmailTemplate } from "../../../domain/entities/email-template.entity"
import type { EmailTempleteRepository } from "../../../domain/repositories/email-template.repository";

export class GetEmailTemplatesUseCase{
    private readonly EmailTemplateRepo : EmailTempleteRepository;
    constructor(
        EmailTemplateRepo : EmailTempleteRepository
    ){
        this.EmailTemplateRepo = EmailTemplateRepo
    }

    async execute():Promise<EmailTemplate[]>{
        return this.EmailTemplateRepo.getAll();
    }
}