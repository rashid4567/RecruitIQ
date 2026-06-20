import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { MarkNotificationAsReadRequestDTO } from "../../application/dto/markNotificationAs.read";

export class MarkNotificationAsReadController {
  constructor(
    private readonly markNotificationAsReadUC: UseCase<
      MarkNotificationAsReadRequestDTO,
      void
    >,
  ) {}

  markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { notificationId } = req.params;
      if (!notificationId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.NOTIFICATION_REQUIRED,
        });
      }

      const markasRead = await this.markNotificationAsReadUC.execute({
        notificationId,
      });
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
