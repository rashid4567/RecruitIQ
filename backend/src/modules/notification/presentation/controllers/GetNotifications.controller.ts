import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { GetNotificationsRequest } from "../../application/dto/getNotification.dto";
import { Notification } from "../../domain/entities/Notification";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class GetNotificationsController {
  constructor(
    private readonly _getNotificationUC: IUseCase<
      GetNotificationsRequest,
      Notification[]
    >,
  ) {}

  getNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipientId = req.user?.userId;
      if (!recipientId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const notifications = await this._getNotificationUC.execute({
        recipientId,
        page,
        limit,
      });

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.NOTIFICATIONS_FETCHED_SUCCESSFULLY,
        notifications.map((notification) => notification.getProps()),
      );
    } catch (err) {
      next(err);
    }
  };
}
