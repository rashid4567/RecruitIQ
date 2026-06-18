import { Request, Response, NextFunction } from "express";
import { DeleteNotificationUseCase } from "../../application/usecases/DeleteNotificationUseCase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../constants/success-message.constants";

export class DeleteNotificationController {
  constructor(
    private readonly deleteNotificationUC: DeleteNotificationUseCase,
  ) {}
  deleteNotification = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }
      const notification = await this.deleteNotificationUC.execute(id);
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
