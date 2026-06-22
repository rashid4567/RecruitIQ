import { Request, Response, NextFunction } from "express";
import { SubscribePlanUseCase } from "../../../application/usecase/Recruiter/subscribe-plan.usecase";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { SubscribePlanRequestDTO } from "../../../application/dto/subscribe.plan-dto";
import { RecruiterSubscription } from "../../../domain/entities/recruiter-subscription.entity";

export class SubscribePlanController {
  constructor(private readonly subscribeUC: UseCase<SubscribePlanRequestDTO,RecruiterSubscription>) {}

  subscribe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }

      const { planId } = req.body;
      if (!planId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.PLAN_ID_NOT_FOUND,
        });
      }
      const result = await this.subscribeUC.execute({recruiterId, planId});

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.SUBSCRIPTION_PLAN_CREATED_SUCCESSFULLY,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
