import fs from "fs";
import path from "path";
import crypto from "crypto";

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
            parsed.id ?? crypto.randomUUID(),
            parsed.type,
            parsed.to,
            parsed.subject,
            parsed.status,
            parsed.createdAt ? new Date(parsed.createdAt) : new Date(),
            parsed.error,
          );
        } catch (error) {
          console.error("Failed to parse email log:", error);
          return null;
        }
      })
      .filter((log): log is EmailLog => log !== null);

    return logs.reverse();
  }
}
