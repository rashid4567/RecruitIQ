import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../../shared/constants/httpStatus";
import { SubscriptionPlanFilter } from "../../../../domain/repository/subscription-plan.repository";
import { SUCCESS_MESSAGES } from "../../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../../shared/interfaces/usecase.interface";
import { GetAllPlansRequestDTO, GetAllPlansResponseDTO } from "../../../../application/dto/get-all-plans.dto";

export class GetSubscriptionPlanController {
  constructor(private readonly getAllPlansUC: IUseCase<
    GetAllPlansRequestDTO,
    GetAllPlansResponseDTO
  >) {}

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
        message: SUCCESS_MESSAGES.SUBSCRIPTION_PLANS_FETCHED_SUCCESSFULLY,
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
