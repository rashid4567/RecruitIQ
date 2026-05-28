import type { EmailTempleteRepository } from "@/module/admin/domain/repositories/email-template.repository";

export class SendTestEmailUseCase{
    private readonly EmailTempleteRepo : EmailTempleteRepository;
    constructor(
        EmailTempleteRepo : EmailTempleteRepository
    ){
        this.EmailTempleteRepo = EmailTempleteRepo
    }

    async execute(id : string, email : string):Promise<void>{
        return this.EmailTempleteRepo.sendTestEmail(id , email)
    }
}