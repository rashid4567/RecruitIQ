import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { BlockJobPostRequestDTO } from "../../../application/dto/job.status.dto";
import { Job } from "../../../domain/entities/job.entity";

export class BlockJobController {
  constructor(private readonly blockUc: UseCase<BlockJobPostRequestDTO, Job>) {}

  block = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobId = req.params.jobPostId;
      if (!jobId) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGE.JOB_ID_REQUIRED,
        });
      }
      const job = await this.blockUc.execute({jobId});
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.JOB_BLOCKED_SUCCESSFULLY,
        data: job,
      });
    } catch (err) {
      next(err);
    }
  };
}
