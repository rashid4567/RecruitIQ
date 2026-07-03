import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { UnreadNotificationRequestDTO } from "../../application/dto/unreadNotification.dto";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class GetUnreadNotificationCountController {
  constructor(
    private readonly _getUnreadCountUC: IUseCase<
      UnreadNotificationRequestDTO,
      number
    >,
  ) {}

  getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipientId = req.user!.userId;
      if (!recipientId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }

      const unreadCount = await this._getUnreadCountUC.execute({ recipientId });
      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.UNREAD_NOTIFICATION_COUNT_FETCHED_SUCCESSFULLY,
        unreadCount,
      );
    } catch (err) {
      next(err);
    }
  };
}
