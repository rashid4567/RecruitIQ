import { ActivityLogRepository } from "../../../domain/repositories/activity-log.repository";

import { ActivityLog } from "../../../domain/entity/activity-log.entity";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";

export class ListActivityLogsUseCase implements IUseCase<void, ActivityLog[]> {
  constructor(private readonly activityLogRepo: ActivityLogRepository) {}

  async execute(): Promise<ActivityLog[]> {
    return await this.activityLogRepo.list();
  }
}
