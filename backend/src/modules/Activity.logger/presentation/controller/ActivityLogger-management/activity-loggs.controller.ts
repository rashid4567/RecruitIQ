import { Request, Response, NextFunction } from "express";
import { ListActivityLogsUseCase } from "../../../application/useCase/activity-log/list-activity-logs.usecase";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { ActivityLog } from "../../../domain/entity/activity-log.entity";

export class ActivityLogsController {
  constructor(private readonly listActivityUC:   UseCase<void, ActivityLog[]>) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logs = await this.listActivityUC.execute();

      res.json({
        success: true,
        message: SUCCESS_MESSAGES.ACTIVITY_LOG_LOADED_SUCCESSFULLY,
        data: logs,
      });
    } catch (err) {
      next(err);
    }
  };
}
