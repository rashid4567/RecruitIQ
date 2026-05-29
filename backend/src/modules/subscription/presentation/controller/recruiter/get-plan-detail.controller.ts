import { Request, Response, NextFunction } from "express";
import { GetSubscriptionPlanUseCase } from "../../../application/usecase/Admin/get-subscription-plan.usecase";
import { planIdParamSchema } from "../../../../recruiter/presentation/validator/Planidparam.validator";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class GetPlanDetailController {
  constructor(private readonly getPlanUC: GetSubscriptionPlanUseCase) {}
  getPlanDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { planId } = planIdParamSchema.parse(req.params);
      const result = await this.getPlanUC.execute(planId);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Plan details fetched successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
