import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { Job, JobType } from "../../../domain/entities/job.entity";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { GetJobsRequestDTO } from "../../../application/dto/getJobPostRequest.dto";
import { PaginatedResult } from "../../../domain/types/job-filter.type";

export class CandidateJobController {
  constructor(
    private readonly jobsUc: IUseCase<GetJobsRequestDTO, PaginatedResult<Job>>,
  ) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this.jobsUc.execute({
        filters: {
          forCandidate: true,
          search: req.query.search as string,
          jobType: req.query.jobType as JobType,
          department: req.query.department as string,
          location: req.query.location as string,
          isRemote:
            req.query.isRemote !== undefined
              ? req.query.isRemote === "true"
              : undefined,
        },
        page,
        limit,
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.JOB_POST_LOADED_SUCCESSFULLY,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
