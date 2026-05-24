import crypto from "crypto";
import { ActivityLogData } from "../../application/types/activity-log-data.type";
import { winstonLogger } from "./winston.logger";

export const logActivity = (data: ActivityLogData): void => {
  winstonLogger.info({
    id: data.id ?? crypto.randomUUID(),
    userId: data.userId,
    action: data.action,
    entityType: data.entityType,
    entityId: data.entityId,
    metadata: data.metadata,
    createdAt: data.createdAt ?? new Date(),
  });
};
