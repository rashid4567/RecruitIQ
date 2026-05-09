import { Request, Response, NextFunction } from "express";
import { GetBillingRecordDetailUseCase } from "../../../application/useCase/subscription.plans/Getbillingrecorddetail.usecase";
import { userIdSchema } from "../../validator/userId.validator";
import { billingRecordIdSchema } from "../../validator/Billing.validator";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class GetBillingRecordDetailController {
  constructor(
    private readonly getBillingRecordDetailUC: GetBillingRecordDetailUseCase,
  ) {}

  getBillingRecordDetail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const recruiterId = userIdSchema.parse(req.user?.userId);

      if (!recruiterId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Recruiter not found",
        });

        return;
      }

      const { billingRecordId } = billingRecordIdSchema.parse(req.params);

      if (!billingRecordId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Billing record ID is required",
        });

        return;
      }

      const record = await this.getBillingRecordDetailUC.execute({
        billingRecordId,
        recruiterId,
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Billing record fetched successfully",
        data: record,
      });
    } catch (err) {
      next(err);
    }
  };
}
