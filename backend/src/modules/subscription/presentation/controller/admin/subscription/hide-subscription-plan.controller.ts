import { Request, Response, NextFunction } from "express";
import { DeactivateSubscriptionPlanUseCase } from "../../../../application/usecase/Admin/subscription/deactivate-subscription-plan.usecase";
import { HTTP_STATUS } from "../../../../../../constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../../constants/success-message.constants";

export class HideSubscriptionPlanController {
  constructor(private readonly hideUC: DeactivateSubscriptionPlanUseCase) {}
  hide = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.hideUC.execute(req.params.planId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.PLAN_HIDDEN_SUCCESSFULLY,
      });
    } catch (err) {
      next(err);
    }
  };
}
