import type { ActivityLog } from "@/module/activity.logger/domain/entity/activity-log.enitity";
import type { ActivityLogRepository } from "../../domain/repositories/activity-log.repository"; 

export class GetActivityLogUseCase{
    private readonly ActivityLogRepo : ActivityLogRepository
    constructor(
        ActivityLogRepo : ActivityLogRepository
    ){
        this.ActivityLogRepo = ActivityLogRepo
    }

    async execute():Promise<ActivityLog[]>{
        return this.ActivityLogRepo.getAll()
    }
}