import { Request, Response, NextFunction } from "express";

import { VerifyPaymentUseCase } from "../../../application/useCase/subscription.plans/VerifyPayment.usecase";

import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class VerifyPaymentController {
  constructor(
    private readonly verifyPaymentUC: VerifyPaymentUseCase
  ) {}

  verifyPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    console.log("\n========== VERIFY PAYMENT CONTROLLER ==========");

    try {

      console.log("REQUEST URL:", req.originalUrl);

      console.log("REQUEST METHOD:", req.method);

      console.log("REQ.USER:", req.user);

      console.log("REQ.BODY:", req.body);

      const razorpay_payment_id =
        req.body?.razorpay_payment_id;

      const razorpay_subscription_id =
        req.body?.razorpay_subscription_id;

      const razorpay_signature =
        req.body?.razorpay_signature;

      console.log(
        "RAZORPAY PAYMENT ID:",
        razorpay_payment_id
      );

      console.log(
        "RAZORPAY SUBSCRIPTION ID:",
        razorpay_subscription_id
      );

      console.log(
        "RAZORPAY SIGNATURE:",
        razorpay_signature
      );

      if (
        !razorpay_payment_id ||
        !razorpay_subscription_id ||
        !razorpay_signature
      ) {

        console.error(
          "MISSING REQUIRED PAYMENT FIELDS"
        );

        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json({
          success: false,
          message:
            "razorpay_payment_id, razorpay_subscription_id, and razorpay_signature are required",
        });
      }

      console.log(
        "CALLING VERIFY PAYMENT USE CASE..."
      );

      const result =
        await this.verifyPaymentUC.execute({
          razorpay_payment_id,
          razorpay_subscription_id,
          razorpay_signature,
        });

      console.log(
        "VERIFY PAYMENT RESULT:",
        result
      );

      console.log(
        "PAYMENT VERIFIED SUCCESSFULLY"
      );

      console.log(
        "===============================================\n"
      );

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Payment verified successfully",
        data: result,
      });

    } catch (err: any) {

      console.error(
        "\n========== VERIFY PAYMENT ERROR =========="
      );

      console.error(
        "ERROR NAME:",
        err?.name
      );

      console.error(
        "ERROR MESSAGE:",
        err?.message
      );

      if (err?.stack) {

        console.error("STACK TRACE:");

        console.error(err.stack);
      }

      console.error("FULL ERROR:", err);

      console.error(
        "==========================================\n"
      );

      next(err);
    }
  };
}