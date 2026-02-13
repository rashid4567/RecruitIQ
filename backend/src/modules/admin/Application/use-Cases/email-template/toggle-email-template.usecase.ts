import { EmailTemplateRepository } from "../../../Domain/repositories/email-template.repository";

export class toggleEmailTemplateUseCase{
    constructor(
        private readonly EmailTemplateRepo : EmailTemplateRepository
    ){};

    async execute(id:string, isActive : boolean){
        return this.EmailTemplateRepo.toggle(id, isActive)
    }
}