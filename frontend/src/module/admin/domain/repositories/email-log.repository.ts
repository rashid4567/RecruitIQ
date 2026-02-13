import type { EmailLog } from "../entities/email-log.entity";


export interface EmailLogRepository {
  getAll(): Promise<EmailLog[]>;
}
