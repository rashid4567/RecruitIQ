import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../../shared/constants/httpStatus";
import { CreateSubscriptionPlanUseCase } from "../../../../application/usecase/Admin/subscription/create-subscription-plan.usecase";
import { CreatePlanSchema } from "../../../validator/subscription-plan.schema";
import { SUCCESS_MESSAGES } from "../../../../../../shared/constants/success-message.constants";

export class CreateSubscriptionPlanController {
  constructor(private readonly createPlanUC: CreateSubscriptionPlanUseCase) {}
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreatePlanSchema.parse(req.body);
      const result = await this.createPlanUC.execute(input);
      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.SUBSCRIPTION_PLAN_CREATED_SUCCESSFULLY,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
