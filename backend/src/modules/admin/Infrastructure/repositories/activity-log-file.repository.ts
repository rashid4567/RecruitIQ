import fs from "fs/promises";
import path from "path";
import { ActivityLogRepository } from "../../Domain/repositories/activity-log.repository";
import { ActivityLog } from "../../Domain/entities/activity-log.entity";

export class ActivityLogFileRepository implements ActivityLogRepository {
  private logPath = path.join(process.cwd(), "logs/activity.log");

  async list(): Promise<ActivityLog[]> {
    try {
      const file = await fs.readFile(this.logPath, "utf-8");

      const lines = file.split("\n").filter(Boolean);

      return lines.map((line) => {
        const data = JSON.parse(line);

       
        const logData = data.message || {};

        return new ActivityLog(
          logData.userId,
          logData.action,
          logData.entityType,
          logData.entityId,
          logData.metadata,
          new Date(data.timestamp)
        );
      });
    } catch (err) {
      console.error("Error reading activity logs:", err);
      return [];
    }
  }
}
