import { Request, Response, NextFunction } from "express";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { CloseJobRequest } from "../../../application/dto/close.jobs.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";

export class CloseJobController {
  constructor(private readonly _closeJobUC: IUseCase<CloseJobRequest, void>) {}

  close = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }

      const jobId = req.params.id;

      if (!jobId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.JOB_ID_REQUIRED,
        );
      }

      const result = await this._closeJobUC.execute({
        recruiterId,
        jobId,
      });

      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.JOB_CLOSED_SUCCESSFULLY,
        result,
      );
    } catch (err) {
      next(err);
    }
  };
}
