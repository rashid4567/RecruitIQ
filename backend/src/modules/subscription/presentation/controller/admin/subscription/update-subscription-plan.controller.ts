import { Request, Response, NextFunction } from "express";
import { UpdateSubscriptionPlanUseCase } from "../../../../application/usecase/Admin/subscription/update-subscription-plan.usecase";
import { UpdatePlanSchema } from "../../../validator/subscription-plan.schema";
import { HTTP_STATUS } from "../../../../../../constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../../constants/success-message.constants";

export class UpdateSubscriptionPlanController {
  constructor(private readonly updateUc: UpdateSubscriptionPlanUseCase) {}
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { planId } = req.params;
      if (!planId) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGE.PLAN_ID_NOT_FOUND,
        });
      }
      const input = UpdatePlanSchema.parse(req.body);
      console.log("input :-", input);
      const result = await this.updateUc.execute(planId, input);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.SUBSCRIPTION_PLAN_UPDATED_SUCCESSFULLY,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
