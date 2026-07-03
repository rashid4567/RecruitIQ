import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { GetJobByIdRequestDTO } from "../../../application/dto/getJobPostById.dto";
import { Job } from "../../../domain/entities/job.entity";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";

export class RecruiterJobByIdController {
  constructor(private readonly _getUc: IUseCase<GetJobByIdRequestDTO, Job>) {}
  getOne = async (req: Request, res: Response, next: NextFunction) => {
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
      const job = await this._getUc.execute({ jobId });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: job,
      });

      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.JOB_DETAILS_LOADED_SUCCESSFULLY,
        job,
      );
    } catch (err) {
      next(err);
    }
  };
}
