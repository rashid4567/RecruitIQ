import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { DeleteJobPostRequestDTO } from "../../../application/dto/deleteJob.Dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class DeleteJobController {
  constructor(
    private readonly _deleteUC: IUseCase<DeleteJobPostRequestDTO, void>,
  ) {}

  delete = async (req: Request, res: Response, next: NextFunction) => {
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
          ERROR_MESSAGE.JOB_POST_IS_REQUIRED,
        );
      }
      await this._deleteUC.execute({ jobId, recruiterId });
      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.JOB_DELETED_SUCCESSFULLY,
      );
    } catch (err) {
      next(err);
    }
  };
}
