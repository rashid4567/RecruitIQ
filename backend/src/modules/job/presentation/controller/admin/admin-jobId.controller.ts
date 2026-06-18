import { Request, Response, NextFunction } from "express";
import { GetJobByIdUseCase } from "../../../application/usecase/job/get-jobpost-by-id.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";

export class AdminJobByIdController {
  constructor(private readonly getJobsIdUc: GetJobByIdUseCase) {}

  getOne = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const jobId = req.params.jobPostId;

      if (!jobId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.JOB_ID_REQUIRED,
        });
      }

      const job = await this.getJobsIdUc.execute(jobId);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.JOB_POST_LOADED_SUCCESSFULLY,
        data: job,
      });
    } catch (err) {
      next(err);
    }
  };
}