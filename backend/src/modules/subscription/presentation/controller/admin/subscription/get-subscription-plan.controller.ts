import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../../constants/httpStatus";
import { GetAllSubscriptionPlansUseCase } from "../../../../application/usecase/Admin/subscription/get-all-subscription-plans.usecase";
import { SubscriptionPlanFilter } from "../../../../domain/repository/subscription-plan.repository";

export class GetSubscriptionPlanController {
  constructor(private readonly getAllPlansUC: GetAllSubscriptionPlansUseCase) {}

  getAllPlans = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      const filter: SubscriptionPlanFilter = {
        isActive:
          req.query.isActive !== undefined
            ? req.query.isActive === "true"
            : undefined,

        planType: req.query.planType as SubscriptionPlanFilter["planType"],
        page: !isNaN(page) && page > 0 ? page : undefined,
        limit: !isNaN(limit) && limit > 0 ? limit : undefined,
      };

      const { data, total } = await this.getAllPlansUC.execute(filter);
      const pageValue = filter.page ?? 1;
      const limitValue = filter.limit ?? 10;
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Subscription plans fetched successfully",
        data,
        total,
        page: pageValue,
        limit: limitValue,
        hasMore: total > pageValue * limitValue,
      });
    } catch (err) {
      next(err);
    }
  };
}
