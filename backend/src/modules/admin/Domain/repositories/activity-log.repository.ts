import { ActivityLog } from "../entities/activity-log.entity";

export interface ActivityLogRepository{
    list():Promise<ActivityLog[]>
}