import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { EmailLog } from "../../../domain/entities/email-log.entity";

export class EmailLogsController {
  constructor(private readonly listLoginUC: UseCase<void, EmailLog[]>) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logs = await this.listLoginUC.execute();
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.EMAIL_LOGS_LOADED_SUCCESSFULLY,
        data: logs,
      });
    } catch (err) {
      return next(err);
    }
  };
}
