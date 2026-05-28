import api from "@/api/axios";
import { ActivityLog } from "../../domain/entity/activity-log.enitity";
import type {
  ActivityLogRepository,
} from "../../domain/repositories/activity-log.repository";

import type {
  MetadataValue,
} from "../../domain/entity/activity-log.enitity";

interface ActivityLogResponse {
  userId?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, MetadataValue>;
  timestamp?: string;
}

export class ApiActivityLogRepository implements ActivityLogRepository {
  async getAll(): Promise<ActivityLog[]> {
    const res = await api.get("/admin/activity-logs");

    const rawLogs: ActivityLogResponse[] = res.data?.data ?? [];

    return rawLogs.map(
      (item: ActivityLogResponse) =>
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