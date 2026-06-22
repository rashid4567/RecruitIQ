import { Request, Response, NextFunction } from "express";
import { DeactivateSubscriptionPlanUseCase } from "../../../../application/usecase/Admin/subscription/deactivate-subscription-plan.usecase";
import { HTTP_STATUS } from "../../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../../shared/constants/success-message.constants";
import { DeactivateSubscriptionPlanRequestDTO } from "../../../../application/dto/deactivate-subscription-plan.dto";
import { UseCase } from "../../../../../../shared/interfaces/usecase.interface";

export class HideSubscriptionPlanController {
  constructor(
    private readonly hideUC: UseCase<
      DeactivateSubscriptionPlanRequestDTO,
      void
    >,
  ) {}
  hide = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const planId = req.params.planId;

      if (!planId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Plan not found",
        });
      }
      await this.hideUC.execute({ planId });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.PLAN_HIDDEN_SUCCESSFULLY,
      });
    } catch (err) {
      next(err);
    }
  };
}
