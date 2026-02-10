import { EmailLog } from "../entities/email-log.entity";

export interface EmailLogRepository{
    list():Promise<EmailLog[]>
}