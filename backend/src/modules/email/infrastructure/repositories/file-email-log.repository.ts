import fs from "fs";
import path from "path";

import { EmailLogRepository } from "../../domain/repository/email-log.repository";
import { EmailLog } from "../../domain/entities/email-log.entity";

const LOG_FILE = path.join(process.cwd(), "logs", "email.log");

export class FileEmailLogRepository implements EmailLogRepository {
  async list(): Promise<EmailLog[]> {
    if (!fs.existsSync(LOG_FILE)) {
      return [];
    }

    const data = await fs.promises.readFile(LOG_FILE, "utf-8");

    const logs = data
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        try {
          const parsed = JSON.parse(line);
          return new EmailLog(
            parsed.id,
            parsed.type,
            parsed.to,
            parsed.subject,
            parsed.status,
            new Date(parsed.timestamp),
            parsed.error,
          );
        } catch {
          return null;
        }
      })
      .filter(Boolean) as EmailLog[];
    return logs.reverse();
  }
}
