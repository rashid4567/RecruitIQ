import { Request, Response, NextFunction } from "express";
import { CancelSubscriptionUseCase } from "../../../application/usecase/Recruiter/CancelSubscriptionUseCase";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";

export class CancelSubscriptionController {
  constructor(private readonly cancelUC: CancelSubscriptionUseCase) {}

  cancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message:ERROR_MESSAGE.UNAUTHORIZED,
        });
      }
      await this.cancelUC.execute(recruiterId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.SUBSCRIPTION_CANCELLED, 
      });
    } catch (err) {
      next(err);
    }
  };
}
