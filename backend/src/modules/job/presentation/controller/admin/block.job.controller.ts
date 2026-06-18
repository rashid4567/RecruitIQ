import { Request, Response, NextFunction } from "express";
import { BlockJobUseCase } from "../../../application/usecase/job/block-job-usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";

export class BlockJobController {
  constructor(private readonly blockUc: BlockJobUseCase) {}

  block = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobId = req.params.jobPostId;
      if (!jobId) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGE.JOB_ID_REQUIRED,
        });
      }
      const job = await this.blockUc.execute(jobId);
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
