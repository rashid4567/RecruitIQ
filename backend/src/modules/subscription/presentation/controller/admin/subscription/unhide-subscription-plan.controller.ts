import { Request, Response, NextFunction } from "express";
import { ActiveSubscriptionPlanUseCase } from "../../../../application/usecase/Admin/subscription/activate-subscription-plan.usecase";
import { HTTP_STATUS } from "../../../../../../constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../../constants/success-message.constants";

export class UnhideSubscriptionPlanController {
  constructor(private readonly unhideUC: ActiveSubscriptionPlanUseCase) {}
  unhide = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.unhideUC.execute(req.params.planId);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.PLAN_DEACTIVATED_SUCCESSFULLY,
      });
    } catch (err) {
      next(err);
    }
  };
}
