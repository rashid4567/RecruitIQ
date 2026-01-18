import { EmailLogRepository } from "../../domain/repositories/email-log.repository"; 

export class ListEmailUseCase{
    constructor(
        private readonly emailLogoRepo : EmailLogRepository
    ){};
    async execute(){
        const logs = await this.emailLogoRepo.list();
        return logs.reverse();
    }
}