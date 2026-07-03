import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { UpgradeSubscriptionRequestDTO } from "../../../application/dto/upgrade-subscription.dto";
import { RecruiterSubscription } from "../../../domain/entities/recruiter-subscription.entity";

export class UpgradeSubscriptionController {
  constructor(
    private readonly _upgradeSubscriptionUC: IUseCase<
      UpgradeSubscriptionRequestDTO,
      RecruiterSubscription
    >,
  ) {}

  upgrade = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }

      const { planId, durationMonths } = req.body;
      if (!planId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.PLAN_ID_NOT_FOUND,
        );
      }
      if (!durationMonths || durationMonths < 1) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.VALID_DURATION_MONTHS_IS_REQUIRED,
        );
      }
      const subscription = await this._upgradeSubscriptionUC.execute({
        recruiterId,
        newPlanId: planId,
        durationMonths,
      });

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.SUBSCRIPTION_UPGRADED_SUCCESSFULLY,
        subscription,
      );
    } catch (err) {
      next(err);
    }
  };
}
