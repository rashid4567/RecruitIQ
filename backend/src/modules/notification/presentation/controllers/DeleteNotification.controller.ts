import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { ApiResponse } from "../../../../shared/utils/api-response";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { DeleteNotificationRequestDTO } from "../../application/dto/deleteNotification.dto";

export class DeleteNotificationController {
  constructor(
    private readonly _deleteNotificationUC: IUseCase<
      DeleteNotificationRequestDTO,
      void
    >,
  ) {}

  deleteNotification = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { notificationId } = req.params;

      if (!notificationId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.NOTIFICATION_REQUIRED,
        );
      }
      await this._deleteNotificationUC.execute({
        notificationId,
      });

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.MESSAGE_DELETED_SUCCESSFULLY,
      );
    } catch (err) {
      next(err);
    }
  };
}
