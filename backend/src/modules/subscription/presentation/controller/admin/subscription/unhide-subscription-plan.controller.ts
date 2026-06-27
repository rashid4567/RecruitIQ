import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../../shared/interfaces/usecase.interface";
import { ActiveSubscriptionPlanRequestDTO } from "../../../../application/dto/active-subscription-plan.dto";

export class UnhideSubscriptionPlanController {
  constructor(
    private readonly unhideUC: IUseCase<ActiveSubscriptionPlanRequestDTO, void>,
  ) {}
  unhide = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const planId = req.params.planId;

      if (!planId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Plan not found",
        });
      }
      await this.unhideUC.execute({ planId });
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.PLAN_DEACTIVATED_SUCCESSFULLY,
      });
    } catch (err) {
      next(err);
    }
  };
}
