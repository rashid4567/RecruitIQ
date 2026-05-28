import type { EmailLog } from "../../../email/domain/entity/email-log.entity";


export interface EmailLogRepository {
  getAll(): Promise<EmailLog[]>;
}
