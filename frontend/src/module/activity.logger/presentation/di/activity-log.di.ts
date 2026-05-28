import { GetActivityLogUseCase } from "../../../activity.logger/application/usecase/GetActivity-logs.usecase";
import { ApiActivityLogRepository } from "../../../activity.logger/infrastructure/repositories/Api-Activity.log.repository";

const ActivityLogRepo = new ApiActivityLogRepository();

export const GetActivityLogUC = new GetActivityLogUseCase(ActivityLogRepo);