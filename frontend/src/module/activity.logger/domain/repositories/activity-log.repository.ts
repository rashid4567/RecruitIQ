import type { ActivityLog } from "../../../activity.logger/domain/entity/activity-log.enitity";

export interface ActivityLogRepository{
    getAll():Promise<ActivityLog[]>
}