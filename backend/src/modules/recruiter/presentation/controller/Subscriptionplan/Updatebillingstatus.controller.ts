import { Request, Response, NextFunction } from "express";
import {UpdateBillingStatusUseCase} from "../../../application/useCase/subscription.plans/Updatebillingstatus.usecase"
import { billingRecordIdSchema, updateBillingStatusSchema } from "../../validator/Billing.validator";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class UpdateBillingStatusController {
  constructor(
    private readonly updateBillingStatusUC: UpdateBillingStatusUseCase,
  ) {}

  // PATCH /subscription/billing/:billingRecordId/status
  updateBillingStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { billingRecordId } = billingRecordIdSchema.parse(req.params);
      const body                = updateBillingStatusSchema.parse(req.body);

      const record = await this.updateBillingStatusUC.execute({
        billingRecordId,
        newStatus:     body.newStatus,
        paidAt:        body.paidAt,
        failureReason: body.failureReason,
        invoiceUrl:    body.invoiceUrl,
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Billing status updated successfully",
        data:    record,
      });
    } catch (err) {
      next(err);
    }
  };
}