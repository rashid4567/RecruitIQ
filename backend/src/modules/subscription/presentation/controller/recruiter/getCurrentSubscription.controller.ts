import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  CurrentSubscriptionResponse,
  GetCurrentSubscriptionRequestDTO,
} from "../../../application/dto/current.subscription.dto";

export class GetCurrentSubsriptionController {
  constructor(
    private readonly _getCurrentSubscriptionUC: IUseCase<
      GetCurrentSubscriptionRequestDTO,
      CurrentSubscriptionResponse
    >,
  ) {}

  getCurrentSubscription = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }
      const subscription = await this._getCurrentSubscriptionUC.execute({
        recruiterId,
      });
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.CURRENT_SUBSCRIPTION_FETCHED_SUCCESSFULLY,
        subscription,
      );
    } catch (err) {
      next(err);
    }
  };
}
