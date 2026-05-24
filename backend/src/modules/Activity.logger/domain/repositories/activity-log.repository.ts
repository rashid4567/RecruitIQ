import { ActivityLog } from "../../../Activity.logger/domain/entity/activity-log.entity";

export interface ActivityLogRepository{
    list():Promise<ActivityLog[]>
}