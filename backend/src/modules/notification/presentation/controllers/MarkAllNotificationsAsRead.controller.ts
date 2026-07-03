import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { MarkAllNotificationsAsReadRequestDTO } from "../../application/dto/markAllAsNeedNotification.dto";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class MarkAllNotificationsAsReadController {
  constructor(
    private readonly _markAllNotificationAsReadUC: IUseCase<
      MarkAllNotificationsAsReadRequestDTO,
      void
    >,
  ) {}
  markAllsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipientId = req.user?.userId;
      if (!recipientId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }

      const markAsRead = await this._markAllNotificationAsReadUC.execute({
        recipientId,
      });
      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.ALL_NOTIFICATIONS_MARKED_AS_READ,
        markAsRead,
      );
    } catch (err) {
      next(err);
    }
  };
}
