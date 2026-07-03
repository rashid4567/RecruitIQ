import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { EmailLog } from "../../../domain/entities/email-log.entity";
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class EmailLogsController {
  constructor(private readonly _listLoginUC: IUseCase<void, EmailLog[]>) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logs = await this._listLoginUC.execute();
   

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.EMAIL_LOGS_LOADED_SUCCESSFULLY,
        logs,
      )
    } catch (err) {
      return next(err);
    }
  };
}
