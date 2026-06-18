import { Request, Response, NextFunction } from "express";
import { MarkNotificationAsReadUseCase } from "../../application/usecases/MarkNotificationAsReadUseCase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../constants/success-message.constants";

export class MarkNotificationAsReadController {
  constructor(
    private readonly markNotificationAsReadUC: MarkNotificationAsReadUseCase,
  ) {}

  markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.NOTIFICATION_REQUIRED,
        });
      }

      const markasRead = await this.markNotificationAsReadUC.execute(id);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.NOTIFICATION_MARKED_AS_READ,
        data: markasRead,
      });
    } catch (err) {
      next(err);
    }
  };
}
