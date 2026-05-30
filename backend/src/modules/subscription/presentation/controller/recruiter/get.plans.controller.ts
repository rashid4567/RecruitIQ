import { Request, Response, NextFunction } from "express";
import { GetAllSubscriptionPlansUseCase } from "../../../application/usecase/Admin/subscription/get-all-subscription-plans.usecase";
import { SubscriptionPlanFilter } from "../../../../admin/Domain/repositories/subscription-plan.repository";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class RecruiterPlanDetailController {
  constructor(private readonly getPlansUC: GetAllSubscriptionPlansUseCase) {}

  getAllPlans = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      const filter: SubscriptionPlanFilter = {
        isActive:
          req.query.isActive !== undefined
            ? req.query.isActive === "true"
            : true,
        planType: req.query.planType as SubscriptionPlanFilter["planType"],
        page: !isNaN(page) && page > 0 ? page : 1,
        limit: !isNaN(limit) && limit > 0 ? limit : 10,
      };
      const { data, total } = await this.getPlansUC.execute(filter);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Plans fetched successfully",
        data,
        total,
        page: filter.page,
        limit: filter.limit,
      });
    } catch (err) {
      next(err);
    }
  };
}
