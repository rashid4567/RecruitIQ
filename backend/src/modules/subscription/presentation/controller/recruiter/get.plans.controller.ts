import { Request, Response, NextFunction } from "express";
import { GetAllSubscriptionPlansUseCase } from "../../../application/usecase/Admin/subscription/get-all-subscription-plans.usecase";
import { SubscriptionPlanFilter } from "../../../domain/repository/subscription-plan.repository";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  GetAllPlansRequestDTO,
  GetAllPlansResponseDTO,
} from "../../../application/dto/get-all-plans.dto";

export class RecruiterPlanDetailController {
  constructor(
    private readonly getPlansUC: UseCase<
      GetAllPlansRequestDTO,
      GetAllPlansResponseDTO
    >,
  ) {}

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
        message: SUCCESS_MESSAGES.PLAN_DETAILS_FETCHED_SUCCESSFULLY,
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
