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
      console.log("========== VERIFY PAYMENT ==========");
      console.log("BODY:", req.body);

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      console.log("Order ID:", razorpay_order_id);
      console.log("Payment ID:", razorpay_payment_id);
      console.log("Signature:", razorpay_signature);

      const result = await this.verifyPaymentUC.execute({
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      });

      console.log("VERIFY RESULT:", result);

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