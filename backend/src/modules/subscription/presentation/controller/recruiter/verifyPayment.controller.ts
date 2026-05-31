import { Request, Response, NextFunction } from "express";
import { VerifyPaymentUseCase } from "../../../application/usecase/Recruiter/VerifyPaymentUseCase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class VerifyPaymentController {
  constructor(
    private readonly verifyPaymentUC: VerifyPaymentUseCase,
  ) {}

  verify = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

     
      const result = await this.verifyPaymentUC.execute({
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Payment verified successfully",
        data: result,
      });
    } catch (err) {
      console.error("VERIFY PAYMENT ERROR:", err);
      next(err);
    }
  };
}