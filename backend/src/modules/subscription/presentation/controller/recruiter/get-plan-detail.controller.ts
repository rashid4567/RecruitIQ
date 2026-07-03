import { Request, Response, NextFunction } from "express";
import { planIdParamSchema } from "../../../../recruiter/presentation/validator/Planidparam.validator";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { GetSubscriptionPlanRequestDTO } from "../../../application/dto/getSubscription.plan.dto";
import { SubscriptionPlan } from "../../../domain/entities/subscription-plan.entity";

export class GetPlanDetailController {
  constructor(
    private readonly _getPlanUC: IUseCase<
      GetSubscriptionPlanRequestDTO,
      SubscriptionPlan
    >,
  ) {}

  getPlanDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { planId } = planIdParamSchema.parse(req.params);
      const result = await this._getPlanUC.execute({ planId });
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.PLAN_DETAILS_FETCHED_SUCCESSFULLY,
        result,
      );
    } catch (err) {
      next(err);
    }
  };
}
