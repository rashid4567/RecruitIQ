import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  CreatePaymentOrderRequestDTO,
  CreatePaymentOrderResponseDTO,
} from "../../../application/dto/createSubscription.dto";
export class CreatePaymentOrderController {
  constructor(
    private readonly _createPaymentUC: IUseCase<
      CreatePaymentOrderRequestDTO,
      CreatePaymentOrderResponseDTO
    >,
  ) {}
  create = async (req: Request, res: Response, next: NextFunction) => {
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
      if (!durationMonths) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.DURATION_IS_REQUIRED,
        );
      }
      const result = await this._createPaymentUC.execute({
        recruiterId,
        planId,
        durationMonths,
      });
      return ApiResponse.success(
        res,
        HTTP_STATUS.CREATED,
        SUCCESS_MESSAGES.PAYMENT_ORDER_CREATED_SUCCESSFULLY,
        result,
      );
    } catch (err) {
      next(err);
    }
  };
}
