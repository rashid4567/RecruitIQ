import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

import { ActivityLogRepository } from "../../domain/repositories/activity-log.repository";
import { ActivityLog } from "../../domain/entity/activity-log.entity";
export class ActivityLogFileRepository implements ActivityLogRepository {
  private readonly logPath = path.join(process.cwd(), "logs", "activity.log");
  async list(): Promise<ActivityLog[]> {
    try {
      const file = await fs.readFile(this.logPath, "utf-8");
      const lines = file.split("\n").filter(Boolean);
      const logs = lines
        .map((line) => {
          try {
            const raw = JSON.parse(line);
            const log = raw.message ?? raw;
            return new ActivityLog(
              log.id ?? crypto.randomUUID(),
              log.userId,
              log.action,
              log.entityType,
              log.entityId,
              log.metadata,
              new Date(log.createdAt ?? raw.timestamp ?? new Date()),
            );
          } catch (err) {
            return null;
          }
        })
        .filter(Boolean) as ActivityLog[];
      return logs.reverse();
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}
