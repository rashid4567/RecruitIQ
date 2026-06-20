import { Request, Response, NextFunction } from "express";
import { GetNotificationsUseCase } from "../../application/usecases/GetNotificationsUseCase";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { GetNotificationsRequest } from "../../application/dto/getNotification.dto";
import { Notification } from "../../domain/entities/Notification";

export class GetNotificationsController {
  constructor(
    private readonly getNotificationUC: UseCase<
      GetNotificationsRequest,
      Notification[]
    >,
  ) {}

  getNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipientId = req.user?.userId;
      if (!recipientId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const notifications = await this.getNotificationUC.execute({
        recipientId,
        page,
        limit,
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.NOTIFICATIONS_FETCHED_SUCCESSFULLY,
        data: notifications.map((notification) => notification.getProps()),
      });
    } catch (err) {
      next(err);
    }
  };
}
