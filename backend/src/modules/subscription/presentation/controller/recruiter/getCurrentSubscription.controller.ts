import { Request, Response, NextFunction } from "express";
import { GetCurrentSubscriptionUseCase } from "../../../application/usecase/Recruiter/GetCurrentSubscriptionUseCase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";

export class GetCurrentSubsriptionController {
  constructor(
    private readonly getCurrentSubscriptionUC: GetCurrentSubscriptionUseCase,
  ) {}

  getCurrentSubscription = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }

      const subscription =
        await this.getCurrentSubscriptionUC.execute(recruiterId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.CURRENT_SUBSCRIPTION_FETCHED_SUCCESSFULLY,
        data: subscription,
      });
    } catch (err) {
      next(err);
    }
  };
}
