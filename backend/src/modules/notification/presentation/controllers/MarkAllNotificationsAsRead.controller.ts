import { Request, Response, NextFunction } from "express";
import { MarkAllNotificationsAsReadUseCase } from "../../application/usecases/MarkAllNotificationsAsReadUseCase";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { MarkAllNotificationsAsReadRequestDTO } from "../../application/dto/markAllAsNeedNotification.dto";

export class MarkAllNotificationsAsReadController {
  constructor(
    private readonly markAllNotificationAsReadUC: UseCase<
      MarkAllNotificationsAsReadRequestDTO,
      void
    >,
  ) {}
  markAllsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipientId = req.user?.userId;
      if (!recipientId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }

      const markAsRead = await this.markAllNotificationAsReadUC.execute({
        recipientId,
      });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.ALL_NOTIFICATIONS_MARKED_AS_READ,
        data: markAsRead,
      });
    } catch (err) {
      next(err);
    }
  };
}
