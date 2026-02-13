import { ActivityLogRepository } from "../../../Domain/repositories/activity-log.repository";

export class ListActivityLogUseCase{
    constructor(
        private readonly activityLogRepo : ActivityLogRepository
    ){};

    async execute(){
        const logs = await this.activityLogRepo.list();
        return [...logs].reverse();
    }
}