import { Request, Response, NextFunction } from "express";
import { CreatePaymentOrderUseCase } from "../../../application/usecase/Recruiter/CreatePaymentOrderUseCase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";

export class CreatePaymentOrderController {
  constructor(private readonly createPaymentUc: CreatePaymentOrderUseCase) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
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

      if (!durationMonths) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.DURATION_IS_REQUIRED,
        });
      }

      const result = await this.createPaymentUc.execute({
        recruiterId,
        planId,
        durationMonths,
      });

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.PAYMENT_ORDER_CREATED_SUCCESSFULLY,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
