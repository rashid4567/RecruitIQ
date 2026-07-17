import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { JobType } from "../../../domain/entities/job.entity";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  GetJobsRequestDTO,
  CandidateJobResponse,
} from "../../../application/dto/candidatejobpost.dto";
import { PaginatedResult } from "../../../domain/types/job-filter.type";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";

export class CandidateJobController {
  constructor(
    private readonly _jobsUc: IUseCase<
      GetJobsRequestDTO,
      PaginatedResult<CandidateJobResponse>
    >,
  ) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const candidateId = req.user?.userId;

      if(!candidateId){
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        )
      }
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this._jobsUc.execute({
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
        candidateId
      });

      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.JOB_POST_LOADED_SUCCESSFULLY,
        result,
      );
    } catch (err) {
      next(err);
    }
  };
}