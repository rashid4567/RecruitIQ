import type { ActivityLog } from "../entities/activity-log.enitity";

export interface ActivityLogRepository{
    getAll():Promise<ActivityLog[]>
}