import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  VerifyPaymentRequestDTO,
  VerifyPaymentResponseDTO,
} from "../../../application/dto/verifyPayment.dto";

export class VerifyPaymentController {
  constructor(
    private readonly _verifyPaymentUC: IUseCase<
      VerifyPaymentRequestDTO,
      VerifyPaymentResponseDTO
    >,
  ) {}

  verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

      const result = await this._verifyPaymentUC.execute({
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      });

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.PAYMENT_VERIFIED_SUCCESSFULLY,
        result,
      );
    } catch (err) {
      next(err);
    }
  };
}
