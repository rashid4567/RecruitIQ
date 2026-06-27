import { Request, Response, NextFunction } from "express";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { ActivityLog } from "../../../domain/entity/activity-log.entity";

export class ActivityLogsController {
  constructor(private readonly listActivityUC: IUseCase<void, ActivityLog[]>) {}

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
