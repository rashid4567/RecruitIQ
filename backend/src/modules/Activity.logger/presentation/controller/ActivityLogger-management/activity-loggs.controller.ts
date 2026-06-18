import { Request, Response, NextFunction } from "express";
import { ListActivityLogsUseCase } from "../../../application/useCase/activity-log/list-activity-logs.usecase";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";

export class ActivityLogsController {
  constructor(private readonly listActivityUC: ListActivityLogsUseCase) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logs = await this.listActivityUC.execute();

      res.json({
        success: true,
        message: SUCCESS_MESSAGES.ACTIVITY_LOG_LOADDED_SUCCESFULLY,
        data: logs,
      });
    } catch (err) {
      next(err);
    }
  };
}
