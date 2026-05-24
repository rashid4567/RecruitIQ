import { ListActivityLogsUseCase } from "../../application/useCase/activity-log/list-activity-logs.usecase";
import { ActivityLogFileRepository } from "../../infrastructure/repositories/activity-log-file.repository";
import { ActivityLogsController } from "../controller/ActivityLogger-management/activity-loggs.controller";

const activityLogRepo = new ActivityLogFileRepository();

const listActivityUC = new ListActivityLogsUseCase(activityLogRepo);

export const activityLogsController = new ActivityLogsController(
  listActivityUC,
);
