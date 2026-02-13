import type { ActivityLog } from "@/module/admin/domain/entities/activity-log.enitity";
import type { ActivityLogRepository } from "@/module/admin/domain/repositories/activity-log.repository";

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