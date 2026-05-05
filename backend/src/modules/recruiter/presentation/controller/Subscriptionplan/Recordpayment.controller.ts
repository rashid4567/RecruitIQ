import { Request, Response, NextFunction } from "express";
import { RecordPaymentUseCase } from "../../../application/useCase/subscription.plans/Recordpayment.usecase";
import { userIdSchema } from "../../validator/userId.validator";
import { recordPaymentSchema } from "../../validator/Billing.validator";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class RecordPaymentController {
  constructor(private readonly recordPaymentUC: RecordPaymentUseCase) {}
  recordPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = userIdSchema.parse(req.user?.userId);

      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Recruiter not found",
        });
      }
      const body = recordPaymentSchema.parse(req.body);

      const result = await this.recordPaymentUC.execute({
        recruiterId,
        subscriptionId: body.subscriptionId,
        planId: body.planId,
        planName: body.planName,
        amount: body.amount,
        currency: body.currency,
        tax: body.tax,
        discount: body.discount,
        netAmount: body.netAmount,
        razorpayPaymentId: body.razorpayPaymentId,
        razorpayOrderId: body.razorpayOrderId,
        razorpayInvoiceId: body.razorpayInvoiceId,
        invoiceUrl: body.invoiceUrl,
        eventType: body.eventType,
        periodStart: body.periodStart,
        periodEnd: body.periodEnd,
        paidAt: body.paidAt,
      });

      const status = result.isDuplicate ? HTTP_STATUS.OK : HTTP_STATUS.CREATED;

      res.status(status).json({
        success: true,
        message: result.isDuplicate
          ? "Payment already recorded"
          : "Payment recorded successfully",
        data: result.billingRecord,
        isDuplicate: result.isDuplicate,
      });
    } catch (err) {
      next(err);
    }
  };
}
