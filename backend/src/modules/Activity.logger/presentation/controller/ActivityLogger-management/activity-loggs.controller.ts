import { Request, Response, NextFunction } from "express";
import { ListActivityLogsUseCase } from "../../../application/useCase/activity-log/list-activity-logs.usecase";

export class ActivityLogsController {
  constructor(private readonly listActivityUC: ListActivityLogsUseCase) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logs = await this.listActivityUC.execute();

      res.json({
        success: true,
        message: "Activity log loadded succesfully",
        data: logs,
      });
    } catch (err) {
      next(err);
    }
  };
}
