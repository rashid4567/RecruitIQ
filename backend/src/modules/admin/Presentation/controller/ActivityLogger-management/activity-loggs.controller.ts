import { Request, Response, NextFunction } from "express";
import { ListActivityLogUseCase } from "../../../Application/use-Cases/activity-log/list-activity-logs.usecase";
import { logger } from "../../../../../shared/logger";

export class ActivityLogsController {
  constructor(
    private readonly listActivityUC: ListActivityLogUseCase
  ) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logs = await this.listActivityUC.execute();
       
      res.json({
        success: true,
        message : "Activity log loadded succesfully",
        data: logs,
      });
    } catch (err) {
      logger.error("Failer to fetch activity ", {error : err})
      next(err);
    }
  };
}
