import { GetActivityLogUseCase } from "../../application/useCases/activityLogs/GetActivity-logs.usecase";
import { ApiActivityLogRepository } from "../../infrastructure/repositories/Api-Activity.log.repository";

const ActivityLogRepo = new ApiActivityLogRepository();

export const GetActivityLogUC = new GetActivityLogUseCase(ActivityLogRepo);