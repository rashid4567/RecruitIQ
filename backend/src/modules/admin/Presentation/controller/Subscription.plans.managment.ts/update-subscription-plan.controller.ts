import { Request, Response, NextFunction } from "express";
import { UpdateSubscriptionPlanUseCase } from "../../../Application/use-Cases/subscription-plan/update-plan.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { UpdatePlanSchema } from "../../validator/subscription-plan.schema";

export class UpdateSubscriptionPlanController {
  constructor(private readonly updatePlanUC: UpdateSubscriptionPlanUseCase) {}

  updatedPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { planId } = req.params;

      if (!planId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Plan ID is required",
        });
      }
      const parsed = UpdatePlanSchema.parse(req.body);
      const updatedPlan = await this.updatePlanUC.execute(planId, parsed);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Subscription plan updated successfully",
        data: updatedPlan,
      });
    } catch (err) {
      next(err);
    }
  };
}
