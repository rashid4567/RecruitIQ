import api from "@/api/axios";
import { ActivityLog } from "../../domain/entities/activity-log.enitity";
import type { ActivityLogRepository } from "../../domain/repositories/activity-log.repository";

export class ApiActivityLogRepository implements ActivityLogRepository {
  async getAll(): Promise<ActivityLog[]> {
    const res = await api.get("/admin/activity-logs");

    const rawLogs = res.data?.data ?? [];

 
    return rawLogs.map(
      (item: any) =>
        new ActivityLog({
          userId: item.userId ?? "",
          action: item.action ?? "",
          entityType: item.entityType ?? "",
          entityId: item.entityId ?? "",
          metadata: item.metadata ?? {},
          timestamp: item.timestamp ?? "",
        })
    );
  }
}
