import { Request, Response, NextFunction } from "express";
import { GetUnreadNotificationCountUseCase } from "../../application/usecases/GetUnreadNotificationCountUseCase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";

export class GetUnreadNotificationCountController {
  constructor(
    private readonly getUnreadCountUC: GetUnreadNotificationCountUseCase,
  ) {}

  getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipientId = req.user!.userId;
      if (!recipientId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const unreadCount = await this.getUnreadCountUC.execute(recipientId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Unread message count fetched succesfully",
        data: unreadCount,
      });
    } catch (err) {
      next(err);
    }
  };
}
