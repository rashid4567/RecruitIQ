import { Request, Response, NextFunction } from "express";
import { GetJobsUseCase } from "../../../application/usecase/job/get-jobs.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class RecruiterJobController {
  constructor(private readonly jobsUc: GetJobsUseCase) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
        });
      }

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const result = await this.jobsUc.execute(
        {
          recruiterId,
        },
        page,
        limit,
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
