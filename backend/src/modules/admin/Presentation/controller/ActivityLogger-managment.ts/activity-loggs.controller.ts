import { Request, Response, NextFunction } from "express";
import { ListActivityLogUseCase } from "../../../Application/use-Cases/activity-log/list-activity-logs.usecase";

export class ActivityLogsController {
  constructor(
    private readonly listActivityUC: ListActivityLogUseCase
  ) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logs = await this.listActivityUC.execute();
        console.log("logs", logs);
      res.json({
        success: true,
        message : "Activity log loadded succesfully",
        data: logs,
      });
    } catch (err) {
      next(err);
    }
  };
}
