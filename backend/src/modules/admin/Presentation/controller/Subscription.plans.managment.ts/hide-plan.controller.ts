import { Request, Response, NextFunction } from "express";
import { HidePlanUseCase } from "../../../Application/use-Cases/subscription-plan/hide-plan.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class HidePlanController {
  constructor(private readonly hidePlanUC: HidePlanUseCase) {}

  hidePlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { planId } = req.params;

      if (!planId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Plan ID is required",
        });
      }

      await this.hidePlanUC.execute(planId);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Subscription plan hidden successfully",
      });
    } catch (err) {
      next(err);
    }
  };
}
