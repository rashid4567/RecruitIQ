import { ActivityMetadata } from "../entity/activity-log.entity";

export type ActivityLogData = {
  userId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: ActivityMetadata;
};