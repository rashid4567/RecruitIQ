import { Request, Response, NextFunction } from "express";
import { GetBillingHistoryUseCase } from "../../../application/useCase/subscription.plans/Getbillinghistory.usecase";
import { userIdSchema } from "../../validator/userId.validator";
import { getBillingHistorySchema } from "../../validator/Billing.validator";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";


export class GetBillingHistoryController {
  constructor(
    private readonly getBillingHistoryUC: GetBillingHistoryUseCase
  ) {}


  getBillingHistory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const recruiterId = userIdSchema.parse(req.user?.userId);
      const query       = getBillingHistorySchema.parse(req.query);

      const result = await this.getBillingHistoryUC.execute({
        recruiterId,
        filter: {
          status:    query.status,
          eventType: query.eventType,
          fromDate:  query.fromDate,
          toDate:    query.toDate,
        },
        pagination: {
          page:  query.page,
          limit: query.limit,
        },
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Billing history fetched successfully",
        data:    result,
      });
    } catch (err) {
      next(err);
    }
  };
}