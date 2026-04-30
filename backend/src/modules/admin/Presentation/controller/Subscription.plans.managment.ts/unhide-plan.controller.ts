import { Request, Response, NextFunction } from "express";
import { UnhidePlanUseCase } from "../../../Application/use-Cases/subscription-plan/unhide-plan.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class UnhidePlanController {
  constructor(private readonly unhidePlanUC: UnhidePlanUseCase) {}

  unhidePlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { planId } = req.params;

      if (!planId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Plan ID is required",
        });
      }

      await this.unhidePlanUC.execute(planId);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Subscription plan unhidden successfully",
      });
    } catch (err) {
      next(err);
    }
  };
}
