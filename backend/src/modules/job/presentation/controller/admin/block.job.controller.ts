import { Request, Response, NextFunction } from "express";
import { BlockJobUseCase } from "../../../application/usecase/job/block-job-usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class BlockJobController {
  constructor(private readonly blockUc: BlockJobUseCase) {}

  block = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobId = req.params.jobPostId;
      if (!jobId) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Jobpost not found",
        });
      }
      const job = await this.blockUc.execute(jobId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Job blocked successfully",
        data: job,
      });
    } catch (err) {
      next(err);
    }
  };
}
