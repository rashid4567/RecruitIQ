import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { MarkNotificationAsReadRequestDTO } from "../../application/dto/markNotificationAs.read";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class MarkNotificationAsReadController {
  constructor(
    private readonly _markNotificationAsReadUC: IUseCase<
      MarkNotificationAsReadRequestDTO,
      void
    >,
  ) {}

  markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { notificationId } = req.params;
      if (!notificationId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.NOTIFICATION_REQUIRED,
        );
      }

      const markasRead = await this._markNotificationAsReadUC.execute({
        notificationId,
      });
      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.NOTIFICATION_MARKED_AS_READ,
        markasRead,
      );
    } catch (err) {
      next(err);
    }
  };
}
