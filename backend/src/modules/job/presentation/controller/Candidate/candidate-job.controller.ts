import { Request, Response, NextFunction } from "express";
import { GetJobsUseCase } from "../../../application/usecase/job/get-jobs.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class CandidateJobController {
  constructor(private readonly jobsUc: GetJobsUseCase) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this.jobsUc.execute(
        {
          forCandidate: true,
        },
        page,
        limit,
      );
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Jobpost loaded successfully",
        data: result,
      });
    } catch (err) {
      console.log("err :", err);
      next(err);
    }
  };
}
