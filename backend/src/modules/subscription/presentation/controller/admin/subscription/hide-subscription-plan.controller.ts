import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../../shared/constants/success-message.constants";
import { ERROR_MESSAGE } from "../../../../../../shared/constants/error-message.constants";
import { ApiResponse } from "../../../../../../shared/utils/api-response";
import { IUseCase } from "../../../../../../shared/interfaces/usecase.interface";
import { DeactivateSubscriptionPlanRequestDTO } from "../../../../application/dto/deactivate-subscription-plan.dto";

export class HideSubscriptionPlanController {
  constructor(
    private readonly _hideUC: IUseCase<
      DeactivateSubscriptionPlanRequestDTO,
      void
    >,
  ) {}

  hide = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { planId } = req.params;
      if (!planId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.PLAN_REQUIRED,
        );
      }
      await this._hideUC.execute({ planId });
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.PLAN_HIDDEN_SUCCESSFULLY,
      );
    } catch (err) {
      next(err);
    }
  };
}
