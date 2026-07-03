import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../../shared/constants/success-message.constants";
import { ApiResponse } from "../../../../../../shared/utils/api-response";
import { IUseCase } from "../../../../../../shared/interfaces/usecase.interface";
import { ActiveSubscriptionPlanRequestDTO } from "../../../../application/dto/active-subscription-plan.dto";

export class UnhideSubscriptionPlanController {
  constructor(
    private readonly _unhideUC: IUseCase<
      ActiveSubscriptionPlanRequestDTO,
      void
    >,
  ) {}

  unhide = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { planId } = req.params;
      if (!planId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.PLAN_REQUIRED,
        );
      }
      await this._unhideUC.execute({ planId });
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.PLAN_ACTIVATED_SUCCESSFULLY,
      );
    } catch (err) {
      next(err);
    }
  };
}
