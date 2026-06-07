import { Request, Response, NextFunction } from "express";
import { GetJobByIdUseCase } from "../../../application/usecase/job/get-jobpost-by-id.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

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
          message: "Job post id is required",
        });
      }

      const job = await this.getJobsIdUc.execute(jobId);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Job post loaded successfully",
        data: job,
      });
    } catch (err) {
      next(err);
    }
  };
}