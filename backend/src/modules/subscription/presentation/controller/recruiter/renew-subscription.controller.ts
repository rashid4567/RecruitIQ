import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { RenewSubscriptionRequestDTO } from "../../../application/dto/renew-subscription.dto";
import { RecruiterSubscription } from "../../../domain/entities/recruiter-subscription.entity";

export class RenewSubscriptionController {
  constructor(
    private readonly _renewUC: IUseCase<
      RenewSubscriptionRequestDTO,
      RecruiterSubscription
    >,
  ) {}
  renew = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }

      const result = await this._renewUC.execute({
        recruiterId,
      });
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.SUBSCRIPTION_RENEWED_SUCCESSFULLY,
        result,
      );
    } catch (err) {
      next(err);
    }
  };
}
