import { Request, Response, NextFunction } from "express";
import { GetUnreadNotificationCountUseCase } from "../../application/usecases/GetUnreadNotificationCountUseCase";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { UnreadNotificationRequestDTO } from "../../application/dto/unreadNotification.dto";

export class GetUnreadNotificationCountController {
  constructor(
    private readonly getUnreadCountUC: UseCase<
      UnreadNotificationRequestDTO,
      number
    >,
  ) {}

  getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipientId = req.user!.userId;
      if (!recipientId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }

      const unreadCount = await this.getUnreadCountUC.execute({ recipientId });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message:
          SUCCESS_MESSAGES.UNREAD_NOTIFICATION_COUNT_FETCHED_SUCCESSFULLY,
        data: unreadCount,
      });
    } catch (err) {
      next(err);
    }
  };
}
