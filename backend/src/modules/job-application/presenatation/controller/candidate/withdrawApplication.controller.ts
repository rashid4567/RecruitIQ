import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { WithdrawApplicationRequestDTO } from "../../../application/dto/withdrawApplication.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class WithdrawApplicationController {
  constructor(
    private readonly _withdrawApplicationUC: IUseCase<
      WithdrawApplicationRequestDTO,
      void
    >,
  ) {}

  withdraw = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateId = req.user?.userId;
      if (!candidateId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        )
      }

      const { applicationId } = req.params;
      if (!applicationId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.APPLICATION_REQUIRED,
        )
      }

      await this._withdrawApplicationUC.execute({ applicationId, candidateId });
    } catch (err) {
      next(err);
    }
  };
}
