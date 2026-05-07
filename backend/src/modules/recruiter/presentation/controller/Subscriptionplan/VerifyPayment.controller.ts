import { Request, Response, NextFunction } from "express";
import { VerifyPaymentUseCase } from "../../../application/useCase/subscription.plans/VerifyPayment.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class VerifyPaymentController {
  constructor(private readonly verifyPaymentUC: VerifyPaymentUseCase) {}

  verifyPayment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const razorpay_payment_id = req.body?.razorpay_payment_id;
      const razorpay_order_id = req.body?.razorpay_order_id;
      const razorpay_signature = req.body?.razorpay_signature;
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message:
            "razorpay_payment_id, razorpay_order_id, and razorpay_signature are required",
        });
      }
      const result = await this.verifyPaymentUC.execute({
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      });
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Payment verified successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
