import { Request, Response, NextFunction } from "express";
import { UpdateSubscriptionPlanUseCase } from "../../../../application/usecase/Admin/subscription/update-subscription-plan.usecase";
import { UpdatePlanSchema } from "../../../validator/subscription-plan.schema";
import { HTTP_STATUS } from "../../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../../shared/constants/success-message.constants";
import { SubscriptionPlan } from "../../../../domain/entities/subscription-plan.entity";
import { UpdateSubscriptionPlanRequestDTO } from "../../../../application/dto/update-input.dto";
import { UseCase } from "../../../../../../shared/interfaces/usecase.interface";

export class UpdateSubscriptionPlanController {
  constructor(private readonly updateUc: UseCase<
    UpdateSubscriptionPlanRequestDTO,
    SubscriptionPlan
  > ) {}
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
      const result = await this.updateUc.execute({planId, data : input});
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
