import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { CreateSubscriptionPlanUseCase } from "../../../application/usecase/create-subscription-plan.usecase";
import { CreatePlanSchema } from "../../../../admin/Presentation/validator/subscription-plan.schema";

export class CreateSubscriptionPlanController {
  constructor(private readonly createPlanUC: CreateSubscriptionPlanUseCase) {}
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreatePlanSchema.parse(req.body);
      const result = await this.createPlanUC.execute(input);
      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: "Subscription plan created successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
