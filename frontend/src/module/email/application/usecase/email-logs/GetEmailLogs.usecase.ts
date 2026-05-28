import type { EmailLogRepository } from "@/module/email/domain/repositories/email-log.repository"; 
import {EmailLog} from "../../../domain/entity/email-log.entity"

export class GetEmailLogUseCase{
    private EmailLogRepo : EmailLogRepository;
    constructor(
         EmailLogRepo : EmailLogRepository
    ){
        this.EmailLogRepo = EmailLogRepo
    }

    async execute():Promise<EmailLog[]>{
        return await this.EmailLogRepo.getAll();
    }
}