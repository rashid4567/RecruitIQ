import type { EmailTempleteRepository } from "@/module/admin/domain/repositories/email-template.repository";

export class DeleteEmailTemplateUseCase{
    private readonly EmailTemplateRepo : EmailTempleteRepository
    constructor(
        EmailTemplateRepo : EmailTempleteRepository
    ){
        this.EmailTemplateRepo = EmailTemplateRepo
    }

    async execute(id : string):Promise<void>{
        return this.EmailTemplateRepo.delete(id)
    }
}