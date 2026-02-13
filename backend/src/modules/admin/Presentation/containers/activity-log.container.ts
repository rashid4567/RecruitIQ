import { ListActivityLogUseCase } from "../../Application/use-Cases/activity-log/list-activity-logs.usecase";
import { ActivityLogFileRepository } from "../../Infrastructure/repositories/activity-log-file.repository";
import { ActivityLogsController } from "../controller/ActivityLogger-managment.ts/activity-loggs.controller";

const activityLogRepo = new ActivityLogFileRepository();

const listActivityUC = new ListActivityLogUseCase(activityLogRepo);

export const activityLogsController = new ActivityLogsController(
  listActivityUC,
);
