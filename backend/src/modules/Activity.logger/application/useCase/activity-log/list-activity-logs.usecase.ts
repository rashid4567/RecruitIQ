import { ActivityLogRepository } from "../../../domain/repositories/activity-log.repository";

import { ActivityLog } from "../../../domain/entity/activity-log.entity";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";

export class ListActivityLogsUseCase implements UseCase<void, ActivityLog[]> {
  constructor(private readonly activityLogRepo: ActivityLogRepository) {}

  async execute(): Promise<ActivityLog[]> {
    return await this.activityLogRepo.list();
  }
}
