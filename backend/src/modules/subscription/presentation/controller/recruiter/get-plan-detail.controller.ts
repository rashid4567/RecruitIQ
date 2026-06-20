import { Request, Response, NextFunction } from "express";
import { GetSubscriptionPlanUseCase } from "../../../application/usecase/Admin/subscription/get-subscription-plan.usecase";
import { planIdParamSchema } from "../../../../recruiter/presentation/validator/Planidparam.validator";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";

export class GetPlanDetailController {
  constructor(private readonly getPlanUC: GetSubscriptionPlanUseCase) {}
  getPlanDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { planId } = planIdParamSchema.parse(req.params);

      if (!planId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.PLAN_ID_NOT_FOUND,
        });
      }
      const result = await this.getPlanUC.execute(planId);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.PLAN_DETAILS_FETCHED_SUCCESSFULLY,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
