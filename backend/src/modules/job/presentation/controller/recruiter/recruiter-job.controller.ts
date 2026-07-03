import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { Job, JobStatus, JobType } from "../../../domain/entities/job.entity";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { GetJobsRequestDTO } from "../../../application/dto/getJobPostRequest.dto";
import { PaginatedResult } from "../../../domain/types/job-filter.type";
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class RecruiterJobController {
  constructor(
    private readonly jobsUc: IUseCase<GetJobsRequestDTO, PaginatedResult<Job>>,
  ) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const result = await this.jobsUc.execute({
        filters: {
          recruiterId,
          search: req.query.search as string,
          status: req.query.status as JobStatus,
          jobType: req.query.jobType as JobType,
          department: req.query.department as string,
          isRemote:
            req.query.isRemote !== undefined
              ? req.query.isRemote === "true"
              : undefined,
        },
        page,
        limit,
      });
      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.JOB_LISTED_SUCCESSFULLY,
        result,
      )
    } catch (err) {
      next(err);
    }
  };
}
