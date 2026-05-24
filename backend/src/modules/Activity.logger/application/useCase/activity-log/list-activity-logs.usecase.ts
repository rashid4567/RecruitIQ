import { ActivityLogRepository } from
"../../../domain/repositories/activity-log.repository";

import { ActivityLog } from "../../../domain/entity/activity-log.entity"; 


export class ListActivityLogsUseCase {

  constructor( private readonly activityLogRepo : ActivityLogRepository
  ) {}

  async execute():
  Promise<ActivityLog[]> {

    return await this
    .activityLogRepo
    .list();

  }

}