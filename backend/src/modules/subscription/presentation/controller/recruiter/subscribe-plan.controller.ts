import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { SubscribePlanRequestDTO } from "../../../application/dto/subscribe.plan-dto";
import { RecruiterSubscription } from "../../../domain/entities/recruiter-subscription.entity";

export class SubscribePlanController {
  constructor(
    private readonly _subscribeUC: IUseCase<
      SubscribePlanRequestDTO,
      RecruiterSubscription
    >,
  ) {}

  subscribe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }
      const { planId } = req.body;
      if (!planId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.PLAN_ID_NOT_FOUND,
        );
      }
      const result = await this._subscribeUC.execute({
        recruiterId,
        planId,
      });
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
