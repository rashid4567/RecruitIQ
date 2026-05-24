import { EmailLog } from "../../../email/domain/entities/email-log.entity";

export interface EmailLogRepository{
    list():Promise<EmailLog[]>
}