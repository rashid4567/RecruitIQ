import { Request, Response, NextFunction } from "express";
import { SubscribePlanUseCase } from "../../../application/usecase/Recruiter/subscribe-plan.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";

export class SubscribePlanController {
  constructor(private readonly subscribeUC: SubscribePlanUseCase) {}

  subscribe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }

      const { planId } = req.body;
      if (!planId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.PLAN_ID_NOT_FOUND,
        });
      }
      const result = await this.subscribeUC.execute(recruiterId, planId);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.SUBSCRIPTION_PLAN_CREATED_SUCCESSFULLY,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
