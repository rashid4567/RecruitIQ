import { Request, Response, NextFunction } from "express";

import { HTTP_STATUS } from "../../../../../constants/httpStatus";

import { UnblockJobUseCase } from "../../../application/usecase/job/unblock-job-usecase";
import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { UnblockJobPostRequestDTO } from "../../../application/dto/job.status.dto";
import { Job } from "../../../domain/entities/job.entity";

export class UnblockJobController {
  constructor(
    private readonly unBlockUc: UseCase<UnblockJobPostRequestDTO, Job>,
  ) {}

  unblock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobId = req.params.jobPostId;
      if (!jobId) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGE.JOB_ID_REQUIRED,
        });
      }
      const job = await this.unBlockUc.execute({ jobId });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.JOB_UNBLOCKED_SUCCESSFULLY,
        data: job,
      });
    } catch (err) {
      next(err);
    }
  };
}
