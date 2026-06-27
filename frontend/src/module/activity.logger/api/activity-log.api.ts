import api from "@/api/axios";

import type { ActivityLog, MetadataValue } from "../types/activity-log.types";

interface ActivityLogResponse {
  userId?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, MetadataValue>;
  timestamp?: string;
}

export const getActivityLogs = async (): Promise<ActivityLog[]> => {
  const { data } = await api.get<{
    data: ActivityLogResponse[];
  }>("/admin/activity-logs");

  return (data.data ?? []).map((item) => ({
    userId: item.userId ?? "",
    action: item.action ?? "",
    entityType: item.entityType,
    entityId: item.entityId,
    metadata: item.metadata ?? {},
    timestamp: item.timestamp ?? "",
  }));
};
