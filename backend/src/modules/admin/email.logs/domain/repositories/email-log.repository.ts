import { EmailLog } from "../../domain/entities/email-log.entity";

export interface EmailLogRepository{
    list():Promise<EmailLog[]>
}