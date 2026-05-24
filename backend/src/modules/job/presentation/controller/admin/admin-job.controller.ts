import { Request, Response, NextFunction } from "express";
import { GetJobsUseCase } from "../../../application/usecase/job/get-jobs.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class AdminJobController {
  constructor(private readonly uc: GetJobsUseCase) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const result = await this.uc.execute(
        {
          includeDeleted: true,
        },
        page,
        limit,
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Jobs listed succesfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
