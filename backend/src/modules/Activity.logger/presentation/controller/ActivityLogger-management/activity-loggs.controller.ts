import { Request, Response, NextFunction } from "express";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { ActivityLog } from "../../../domain/entity/activity-log.entity";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";

export class ActivityLogsController {
  constructor(private readonly _listActivityUC: IUseCase<void, ActivityLog[]>) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logs = await this._listActivityUC.execute();
      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.ACTIVITY_LOG_LOADED_SUCCESSFULLY,
        logs
      )
    } catch (err) {
      next(err);
    }
  };
}
