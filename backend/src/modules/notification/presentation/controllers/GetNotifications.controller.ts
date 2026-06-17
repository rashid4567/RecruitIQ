import { Request, Response, NextFunction } from "express";
import { GetNotificationsUseCase } from "../../application/usecases/GetNotificationsUseCase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";

export class GetNotificationsController {
  constructor(private readonly getNotificationUC: GetNotificationsUseCase) {}

  getNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipientId = req.user?.userId;
      if (!recipientId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
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
        message: "Get notifications successfully",
        data: notifications.map((notification) => notification.getProps()),
      });
    } catch (err) {
      next(err);
    }
  };
}
