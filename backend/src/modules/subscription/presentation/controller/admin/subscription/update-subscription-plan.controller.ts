import { Request, Response, NextFunction } from "express";
import { UpdatePlanSchema } from "../../../validator/subscription-plan.schema";
import { HTTP_STATUS } from "../../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../../shared/constants/success-message.constants";
import { ApiResponse } from "../../../../../../shared/utils/api-response";
import { IUseCase } from "../../../../../../shared/interfaces/usecase.interface";
import { SubscriptionPlan } from "../../../../domain/entities/subscription-plan.entity";
import { UpdateSubscriptionPlanRequestDTO } from "../../../../application/dto/update-input.dto";

export class UpdateSubscriptionPlanController {
  constructor(
    private readonly _updateUC: IUseCase<
      UpdateSubscriptionPlanRequestDTO,
      SubscriptionPlan
    >,
  ) {}

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { planId } = req.params;
      if (!planId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.NOT_FOUND,
          ERROR_MESSAGE.PLAN_ID_NOT_FOUND,
        );
      }

      const input = UpdatePlanSchema.parse(req.body);
      const result = await this._updateUC.execute({
        planId,
        data: input,
      });
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.SUBSCRIPTION_PLAN_UPDATED_SUCCESSFULLY,
        result,
      );
    } catch (err) {
      next(err);
    }
  };
}
