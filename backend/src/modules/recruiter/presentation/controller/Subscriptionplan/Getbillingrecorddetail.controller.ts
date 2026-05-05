import { Request, Response, NextFunction } from "express";
import { GetBillingRecordDetailUseCase } from "../../../application/useCase/subscription.plans/Getbillingrecorddetail.usecase";
import { userIdSchema } from "../../validator/userId.validator";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { billingRecordIdSchema } from "../../validator/Billing.validator";

export class GetBillingRecordDetailController {
  constructor(
    private readonly getBillingRecordDetailUC: GetBillingRecordDetailUseCase,
  ) {}

  getBillingRecordDetail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const recruiterId = userIdSchema.parse(req.user?.userId);
      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Recruiter not found",
        });
      }
      const { billingRecordId } = billingRecordIdSchema.parse(req.params);
      if (!billingRecordId) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Billing id not found",
        });
      }

      const record = await this.getBillingRecordDetailUC.execute({
        billingRecordId,
        recruiterId,
      });
    } catch (err) {
      next(err);
    }
  };
}
