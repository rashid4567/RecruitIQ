import { Request, Response, NextFunction } from "express";
import { CancelSubscriptionUseCase } from "../../../application/usecase/Recruiter/CancelSubscriptionUseCase";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { CancelSubscriptionRequestDTO } from "../../../application/dto/cancel-subscription.dto";
import { RecruiterSubscription } from "../../../domain/entities/recruiter-subscription.entity";

export class CancelSubscriptionController {
  constructor(
    private readonly cancelUC: UseCase<
      CancelSubscriptionRequestDTO,
      RecruiterSubscription
    >,
  ) {}

  cancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }
      await this.cancelUC.execute({ recruiterId });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.SUBSCRIPTION_CANCELLED,
      });
    } catch (err) {
      next(err);
    }
  };
}
