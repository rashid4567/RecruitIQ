import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { SubscriptionPlanFilter } from "../../../domain/repository/subscription-plan.repository";
import {
  GetAllPlansRequestDTO,
  GetAllPlansResponseDTO,
} from "../../../application/dto/get-all-plans.dto";

export class RecruiterPlanDetailController {
  constructor(
    private readonly _getPlansUC: IUseCase<
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

      const { data, total } = await this._getPlansUC.execute(filter);
      const pageValue = filter.page ?? 1;
      const limitValue = filter.limit ?? 10;
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.PLAN_DETAILS_FETCHED_SUCCESSFULLY,
        {
          data,
          total,
          page: pageValue,
          limit: limitValue,
          hasMore: total > pageValue * limitValue,
        },
      );
    } catch (err) {
      next(err);
    }
  };
}
