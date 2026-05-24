import { Request, Response, NextFunction } from "express";

import { HTTP_STATUS } from "../../../../../constants/httpStatus";

import { UnblockJobUseCase } from "../../../application/usecase/job/unblock-job-usecase";

export class UnblockJobController {
  constructor(private readonly unBlockUc: UnblockJobUseCase) {}

  unblock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobId = req.params.jobPostId;
      if (!jobId) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Job post not found",
        });
      }
      const job = await this.unBlockUc.execute(jobId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Job unblocked successfully",
        data: job,
      });
    } catch (err) {
      next(err);
    }
  };
}
