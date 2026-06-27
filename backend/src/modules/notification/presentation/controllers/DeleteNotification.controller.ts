import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { DeleteNotificationRequestDTO } from "../../application/dto/deleteNotification.dto";

export class DeleteNotificationController {
  constructor(
    private readonly deleteNotificationUC: IUseCase<
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
      const { notificationId  } = req.params;
      if (!notificationId ) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }
      const notification = await this.deleteNotificationUC.execute({notificationId });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.MESSAGE_DELETED_SUCCESSFULLY,
        data: notification,
      });
    } catch (err) {
      next(err);
    }
  };
}
