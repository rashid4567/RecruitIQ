import { Request, Response, NextFunction } from "express";
import { GetJobsUseCase } from "../../../application/usecase/job/get-jobs.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { JobType } from "../../../domain/entities/job.entity";

export class CandidateJobController {
  constructor(private readonly jobsUc: GetJobsUseCase) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this.jobsUc.execute(
        {
          forCandidate: true,
          search: req.query.search as string,
          jobType: req.query.jobType as JobType,
          department: req.query.department as string,
          location : req.query.location as string,
          isRemote:
            req.query.isRemote !== undefined
              ? req.query.isRemote === "true"
              : undefined,
        },
        page,
        limit,
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Job posts loaded successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
