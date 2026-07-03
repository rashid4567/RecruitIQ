import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { BlockJobPostRequestDTO } from "../../../application/dto/job.status.dto";
import { Job } from "../../../domain/entities/job.entity";
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class BlockJobController {
  constructor(
    private readonly _blockUc: IUseCase<BlockJobPostRequestDTO, Job>,
  ) {}

  block = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobId = req.params.jobPostId;
      if (!jobId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.NOT_FOUND,
          ERROR_MESSAGE.JOB_ID_REQUIRED,
        );
      }
      const job = await this._blockUc.execute({ jobId });
      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.JOB_BLOCKED_SUCCESSFULLY,
        job,
      );
    } catch (err) {
      next(err);
    }
  };
}
