import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { Job, JobStatus, JobType } from "../../../domain/entities/job.entity";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { GetJobsRequestDTO } from "../../../application/dto/getJobPostRequest.dto";
import { PaginatedResult } from "../../../domain/types/job-filter.type";

export class AdminJobController {
  constructor(
    private readonly jobsUc: IUseCase<GetJobsRequestDTO, PaginatedResult<Job>>,
  ) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this.jobsUc.execute({
        filters: {
          search: req.query.search as string,
          status: req.query.status as JobStatus,
          jobType: req.query.jobType as JobType,
          department: req.query.department as string,
          isBlocked:
            req.query.isBlocked !== undefined
              ? req.query.isBlocked === "true"
              : undefined,
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
        message: SUCCESS_MESSAGES.JOB_LISTED_SUCCESSFULLY,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
