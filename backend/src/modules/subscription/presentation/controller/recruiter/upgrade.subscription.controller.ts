import { Request, Response, NextFunction } from "express";
import { UpgradeSubscriptionUseCase } from "../../../application/usecase/Recruiter/UpgradeSubscriptionUseCase";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { UpgradeSubscriptionRequestDTO } from "../../../application/dto/upgrade-subscription.dto";
import { RecruiterSubscription } from "../../../domain/entities/recruiter-subscription.entity";

export class UpgradeSubscriptionController {
  constructor(
    private readonly upgradeSubscriptionUC: UseCase<
      UpgradeSubscriptionRequestDTO,
      RecruiterSubscription
    >,
  ) {}

  upgrade = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }

      const { planId, durationMonths } = req.body;

      if (!planId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.PLAN_ID_NOT_FOUND,
        });
      }

      if (!durationMonths || durationMonths < 1) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.VALID_DURATION_MONTHS_IS_REQUIRED,
        });
      }

      const subscription = await this.upgradeSubscriptionUC.execute({
        recruiterId,
        newPlanId: planId,
        durationMonths,
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.SUBSCRIPTION_UPGRADED_SUCCESSFULLY,
        data: subscription,
      });
    } catch (err) {
      next(err);
    }
  };
}
