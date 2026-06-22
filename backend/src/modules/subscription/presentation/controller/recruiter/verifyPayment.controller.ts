import { Request, Response, NextFunction } from "express";
import { VerifyPaymentUseCase } from "../../../application/usecase/Recruiter/VerifyPaymentUseCase";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  VerifyPaymentRequestDTO,
  VerifyPaymentResponseDTO,
} from "../../../application/dto/verifyPayment.dto";

export class VerifyPaymentController {
  constructor(
    private readonly verifyPaymentUC: UseCase<
      VerifyPaymentRequestDTO,
      VerifyPaymentResponseDTO
    >,
  ) {}

  verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

      const result = await this.verifyPaymentUC.execute({
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.PAYMENT_VERIFIED_SUCCESSFULLY,
        data: result,
      });
    } catch (err) {
      console.error("VERIFY PAYMENT ERROR:", err);
      next(err);
    }
  };
}
