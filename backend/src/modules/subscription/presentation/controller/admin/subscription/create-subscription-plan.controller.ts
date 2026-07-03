import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../../shared/constants/success-message.constants";
import { ApiResponse } from "../../../../../../shared/utils/api-response";
import { CreatePlanSchema } from "../../../validator/subscription-plan.schema";
import { IUseCase } from "../../../../../../shared/interfaces/usecase.interface";
import { CreateSubscriptionPlanRequestDTO } from "../../../../application/dto/createSubscription.dto";
import { SubscriptionPlan } from "../../../../domain/entities/subscription-plan.entity";

export class CreateSubscriptionPlanController {
  constructor(
    private readonly _createPlanUC: IUseCase<
      CreateSubscriptionPlanRequestDTO,
      SubscriptionPlan
    >,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreatePlanSchema.parse(req.body);
      const result = await this._createPlanUC.execute(input);
      return ApiResponse.success(
        res,
        HTTP_STATUS.CREATED,
        SUCCESS_MESSAGES.SUBSCRIPTION_PLAN_CREATED_SUCCESSFULLY,
        result,
      );
    } catch (err) {
      next(err);
    }
  };
}
