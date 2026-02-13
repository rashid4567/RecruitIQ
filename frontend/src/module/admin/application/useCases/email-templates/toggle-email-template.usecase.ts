//import type { EmailLogRepository } from "@/module/admin/domain/repositories/email-log.repository";

import type { EmailTempleteRepository } from "../../../domain/repositories/email-template.repository"

export class ToggleEmailTempleteUseCase{
 
    private readonly EmailTempleteRepo : EmailTempleteRepository
    constructor(
        EmailTempleteRepo : EmailTempleteRepository
    ){
        this.EmailTempleteRepo = EmailTempleteRepo
    }

    async execute(id : string, isActive : boolean){
        return this.EmailTempleteRepo.toggle(id , isActive)
    }

}