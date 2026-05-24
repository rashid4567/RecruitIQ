import { Request, Response, NextFunction } from "express";

import { UnblockJobPostUseCase } from "../../../Application/use-Cases/jobPost-management/update-JobPost.status.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class UnblockJobPostController {
  constructor(private readonly unblockJobPostUC: UnblockJobPostUseCase) {}

  unblock = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { jobPostId } = req.params;

      if (!jobPostId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Job post ID is required",
        });

        return;
      }

      await this.unblockJobPostUC.execute(jobPostId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Job post unblocked successfully",
      });
    } catch (err) {
      next(err);
    }
  };
}
